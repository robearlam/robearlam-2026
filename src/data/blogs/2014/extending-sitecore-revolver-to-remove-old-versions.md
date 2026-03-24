---
title: 'Extending Sitecore Revolver to remove old versions'
slug: 'extending-sitecore-revolver-to-remove-old-versions'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I recently worked on a rebuild of an existing Sitecore site. This involved us doing a completely fresh build, then importing the existing items into the new solution. As the existing solution was live"
publishDate: '2014-11-01'
disqusId: '0c3aaf67-8e6b-440c-b03d-75dd27b361f5'
tags: ['Revolver','Versions','Sitecore']
---
I recently worked on a rebuild of an existing Sitecore site. This involved us doing a completely fresh build, then importing the existing items into the new solution. As the existing solution was live for a while a lot of the items had old versions which no longer had any relevance in the new solution.

We wanted a method to bulk remove all of the old versions of every item in the database, just leaving the current version for each. I had been playing around with <a title="Revolver" href="https://marketplace.sitecore.net/en/Modules/Revolver.aspx" target="_blank" rel="noopener">Sitecore Revolver</a> recently and this sounded like the exact kind of task it was built for. After reading through the <a title="Revolver Quick Start Guide" href="http://www.codeflood.net/files/Revolver-Quick-Start-Guide.pdf" target="_blank" rel="noopener">Quick Start Guide</a> I tried out the *rmv* command, which the guide said would *"Purge previous versions of the item"*. This however seemed to remove all versions of the item in question, including the current one, which wasn't what I was after.

<!--more--> I spent a while longer attempting to use the standard Revolver commands, however I soon realised I was going to have to create my own custom command. This turned out to be just as easy as the guide had suggested. All I had to do was to implement the

*Revolver.Core.ICommand* interface, then perform my processing in the *Run(string[] args)* method. The implementation of that method ended up looking like this:

```
public CommandResult Run(string[] args)
{
    ReadArgs(args);

    if (_context == null)
    {
        return new CommandResult(CommandStatus.Failure, "No Context");
    }

    if (_context.CurrentItem == null)
    {
        return new CommandResult(CommandStatus.Failure, "No Context Item");
    }

    var currentItem = _context.CurrentItem;
    if (currentItem.Versions.Count == 1 && !_recursive)
    {
        return new CommandResult(CommandStatus.Success, "Item only has one verison");
    }

    return BuildResponse(ProcessTrimVersionRequest(currentItem));
}

private CommandResult BuildResponse(string outputText)
{
    return new CommandResult(CommandStatus.Success, outputText);
}

private void ReadArgs(IEnumerable<string> args)
{
    _recursive = args.Any(x => x == RecursiveSwitch);
}

private string ProcessTrimVersionRequest(Item currentItem)
{
    var outputText = TrimVersionsForItem(currentItem);
    if (_recursive)
    {
        foreach (Item childItem in currentItem.Children)
        {
            outputText += ProcessTrimVersionRequest(childItem);
        }
    }

    return outputText;
}

private string TrimVersionsForItem(Item currentItem)
{
    var outputTextLine = String.Empty;
    foreach (var language in currentItem.Languages)
    {
        var langItem = _context.CurrentDatabase.GetItem(currentItem.ID, language);
        if (langItem.Versions.Count <= 1)
        {
            continue;
        }

        outputTextLine = String.Format("Trimmed:{0}, Lang:{1}, Versions:", currentItem.Paths.FullPath, langItem.Language.Name);
        foreach (var verItem in GetOldVersionsForLanguage(currentItem, langItem))
        {
            outputTextLine += verItem.Version.Number.ToString(CultureInfo.InvariantCulture) + ",";
            verItem.Versions.RemoveVersion();
        }
    }

    if (outputTextLine.EndsWith(","))
    {
        outputTextLine = outputTextLine.Substring(0, outputTextLine.Length - 1);
    }

    return String.IsNullOrEmpty(outputTextLine)
               ? outputTextLine
               : outputTextLine + "\r\n";
}

private static IEnumerable<Item> GetOldVersionsForLanguage(Item currentItem, Item langItem)
{
    return langItem.Versions.GetVersions().Where(x => x.Version != currentItem.Versions.GetLatestVersion(langItem.Language).Version);
}
```

This command would delete every version except for the current one, for every language for the item selected. I also allowed for a *-r* switch to passed in to make it run recursively from the context item. To run the command, you first have to bind the it to a moniker using the following Revolver command.

```
bind RevolverExtensions.TrimVersions,RevolverExtensions tv
```

You could then call the version trim command using the *tv* moniker that it had been bound to, so in order to run recursively you would run it by using the following command:

```
tv -r
```

This would then trim all old versions from every item beneath the item that currently has context within Revolver.

I ended up running this from the Sitecore node, removing all old versions of every item in the database. This left us with a much tidier set of items and stopped any content editors from being able to accidentally revert to an old version from before the rebuild.

The code for this is available on my <a title="RevolverExtensions" href="https://github.com/robearlam/RevolverExtensions" target="_blank" rel="noopener">GitHub</a>.

