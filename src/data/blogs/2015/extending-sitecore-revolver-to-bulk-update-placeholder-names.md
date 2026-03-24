---
title: 'Extending Sitecore Revolver to bulk update placeholder names'
slug: 'extending-sitecore-revolver-to-bulk-update-placeholder-names'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "While doing some re-factoring of Sitecore Layouts recently I wanted to rename some placeholders. This caused an issue as the old names were heavily referenced within the CMS, both in standard values"
publishDate: '2015-04-18'
disqusId: '7f4bc177-ca8c-410a-ab1d-c3ac6b33a685'
tags: ['Revolver','Placeholders','Sitecore']
---
While doing some re-factoring of Sitecore Layouts recently I wanted to rename some placeholders. This caused an issue as the old names were heavily referenced within the CMS, both in standard values and directly on some items themselves. After some searching I found that this isn't something that is catered for of out of the box. I decided to extend Sitecore Revolver to create a custom command to handle this.

I created a class that implemented the *Revolver.Core.ICommand* interface, then performed my processing in the *Run(string[] args)* method.

<!--more--> The implementation of the class ended up looking like this:

```
private const string RecursiveSwitch = "-r";
private const string RenderingElementName = "r";
private const string RenderingsFieldName = "__renderings";
private const string DeviceElementName = "d";
private const string PlaceholderAttributeName = "ph";
private Context _context;
private bool _recursive;
private string _oldPlaceHolderName;
private string _newPlaceHolderName;

public void Initialise(Context context, IFormatContext formatContext)
{
    _context = context;
}

public CommandResult Run(string[] args)
{
    ParseSwitchArgs(args);

    if (string.IsNullOrEmpty(_oldPlaceHolderName) || string.IsNullOrEmpty(_newPlaceHolderName))
    {
        return new CommandResult(CommandStatus.Failure, "Required arguements are missing, please use 'help rp' to view documentation");
    }

    if (_context == null)
    {
        return new CommandResult(CommandStatus.Failure, "No Context");
    }

    if (_context.CurrentItem == null)
    {
        return new CommandResult(CommandStatus.Failure, "No Context Item");
    }

    return BuildResponse(ProcessPlaceHolderRename(_context.CurrentItem));
}

private string ProcessPlaceHolderRename(Item currentItem)
{
    var outputText = ReplacePlaceholderNameForItem(currentItem);
    if (_recursive)
    {
        foreach (Item childItem in currentItem.Children)
        {
            outputText += ProcessPlaceHolderRename(childItem);
        }
    }

    return outputText;
}

private string ReplacePlaceholderNameForItem(Item item)
{
    if (item != null && !string.IsNullOrEmpty(item[RenderingsFieldName]))
    {
        var renderingsElement = XElement.Parse(item[RenderingsFieldName]);
        var devices = renderingsElement.Elements(DeviceElementName);

        foreach (var device in devices)
        {
            var renderings = device.Elements(RenderingElementName);
            foreach (var rendering in renderings)
            {
                TrySetAttributeName(rendering);
                TrySetAttributeNameWithNamespace(rendering);
            }
        }

        using (new global::Sitecore.Data.Items.EditContext(item))
        {
            item[RenderingsFieldName] = renderingsElement.ToString();
        }

        return item.Paths.Path + "\r\n";
    }

    return string.Empty;
}

private void TrySetAttributeNameWithNamespace(XElement rendering)
{
    XNamespace ns = "s";
    var itemPlaceHolderAttribute = rendering.Attributes().FirstOrDefault(x => x.Name == ns + PlaceholderAttributeName);
    if (itemPlaceHolderAttribute != null && itemPlaceHolderAttribute.Value.Contains(_oldPlaceHolderName))
    {
        var newValue = itemPlaceHolderAttribute.Value.Replace(_oldPlaceHolderName, _newPlaceHolderName);
        itemPlaceHolderAttribute.SetValue(newValue);
    }
}

private void TrySetAttributeName(XElement rendering)
{
    var placeHolderAttribute = rendering.Attributes().FirstOrDefault(x => x.Name == PlaceholderAttributeName);
    if (placeHolderAttribute != null && placeHolderAttribute.Value.Contains(_oldPlaceHolderName))
    {
        var newValue = placeHolderAttribute.Value.Replace(_oldPlaceHolderName, _newPlaceHolderName);
        placeHolderAttribute.SetValue(newValue);
    }
}

private CommandResult BuildResponse(string outputText)
{
    return new CommandResult(CommandStatus.Success, outputText);
}

private void ParseSwitchArgs(string[] args)
{
    _recursive = args.Any(x => x == RecursiveSwitch);

    if (args.Length >= 2)
    {
        _oldPlaceHolderName = args[0];
        _newPlaceHolderName = args[1];
    }
}
```

This command reads in two parameters, the old placeholder name and the new placeholder name. I also allowed for a *-r* switch to passed in to make it run recursively from the context item. To run the command, you first have to bind the it to a moniker using the following Revolver command.

```
bind RevolverExtensions.RenamePlaceholders,RevolverExtensions rp
```

You could then call the rename placeholders command using the *rp* moniker that it had been bound to, so in order to run recursively you would run it by using the following command:

```
rp old-name new-name -r
```

This would then rename all instances of the old placeholder from every item beneath the item that currently has context within Revolver. After setting this up, the rename task was completed by running this across all of the templates and content items in the tree

The code for this is available on my <a title="RevolverExtensions" href="https://github.com/robearlam/RevolverExtensions" target="_blank" rel="noopener">GitHub</a>.

