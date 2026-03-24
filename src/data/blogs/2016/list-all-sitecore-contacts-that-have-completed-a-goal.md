---
title: 'List all Sitecore contacts that have completed a goal'
slug: 'list-all-sitecore-contacts-that-have-completed-a-goal'
dateCreated: '2020-08-31'
lastUpdated: '2020-09-03'
abstract: "I was recently asked whether it was possible in Sitecore to list all of the contacts who had completed a certain goal. This seemed like a fairly straight forward request, but i couldn't find a way to"
publishDate: '2016-06-25'
disqusId: '43f4e0b5-b204-4b56-b66e-221f27afaec7'
tags: ['Sitecore','xDB','Contacts','Goals','Segmented List','Rules Engine']
---
I was recently asked whether it was possible in Sitecore to list all of the contacts who had completed a goal. This seemed like a fairly straight forward request, but I couldn't find a way to achieve this using out of the box Sitecore functionality (crazy right?)

So I decided to create the functionality myself. This sounded like it should be something easily achievable using a Segmented List and the rules engine to refine the contacts by a Goal, or a combination of Goals. You can see the default rules that are provided to create a Segmented List here, none of them seemed to do what I needed though.

![Default Segmented List rules][1]

I remembered seeing a rule for filtering by completed goals previously in the Visit rule group, and thought it might be possible to be make use of that by assigning the Visit rule group to the Segment Builder rule context.

![Visit rules group][2]

This was simple to achieve by editing the *'Tags'* field on the *'/sitecore/system/Settings/Rules/Segment Builder/Tags/Default item'*. Changing this to now include both Segment Builder and Visit would enable the rules I wanted for Segmented Lists.

However it wasn't that simple, the rules didn't work as I expected. Whenever I attempted to use one of the Visit rules my list would always be empty. I used a decompiler to look into the code for the visit rules and could see the problem, they were using *'Tracker.Current.Contact'* and checking whether that contact had completed the selected goal. Now this would work fine on a CD role, but in the case of a Segmented List which runs on CM this was incorrect.

```
protected override bool Execute(T ruleContext)
{
  Assert.ArgumentNotNull((object) ruleContext, "ruleContext");
  Assert.IsNotNull((object) Tracker.Current, "Tracker.Current is not initialized");
  Assert.IsNotNull((object) Tracker.Current.Session, "Tracker.Current.Session is not initialized");
  Assert.IsNotNull((object) Tracker.Current.Session.Interaction, "Tracker.Current.Session.Interaction is not initialized");
  if (!this.GoalGuid.HasValue)
    return false;
  if (this.HasEventOccurredInInteraction((IInteractionData) Tracker.Current.Session.Interaction))
    return true;
  Assert.IsNotNull((object) Tracker.Current.Contact, "Tracker.Current.Contact is not initialized");
  return this.FilterKeyBehaviorCacheEntries(Tracker.Current.Contact.GetKeyBehaviorCache()).Any<KeyBehaviorCacheEntry>((Func<KeyBehaviorCacheEntry, bool>) (entry =>
  {
    Guid id = entry.Id;
    Guid? goalGuid = this.GoalGuid;
    if (goalGuid.HasValue)
      return id == goalGuid.GetValueOrDefault();
    return false;
  }));
}
```

At this point I realised that I was going to have to create the solution myself. I could see that the data already existed in Mongo, so thought that the simplest solution would be to create a ComputedField on the Analytics Index, which I could then query in my custom rule.

I looked into how the Sitecore Experience Profile application got its data about the goals that a user had completed and could see that it used the *'CustomerIntelligenceManager.ViewProvider.GenerateContactView()'* method, passing in some filter parameters to select what kind of data is returned. I replicated this functionality in my ComputedField to get the completed goals for the Contact currently being indexed.

```
public class GoalsCompletedField : IComputedIndexField
{
    private const string GoalsViewName = "goals";
    public string FieldName { get; set; }
    public string ReturnType { get; set; }

    public object ComputeFieldValue(IIndexable indexable)
    {
        var contactIndexable = indexable as IContactIndexable;
        if (contactIndexable == null)
            return null;

        var contactId = (Guid)contactIndexable.Id.Value;
        if (contactId == Guid.Empty)
            return null;

        var viewParams = new ViewParameters
        {
            ContactId = contactId,
            ViewName = GoalsViewName,
            ViewEntityId = null
        };
        var resultSet = CustomerIntelligenceManager.ViewProvider.GenerateContactView(viewParams);

        return resultSet.Data.Dataset[GoalsViewName].Rows
            .Cast<DataRow>()
            .Select(GetGoalIdFromDataRow())
            .Distinct();
    }

    private static Func<DataRow, object> GetGoalIdFromDataRow()
    {
        return dataRow => dataRow[2];
    }
}
```

I then used the following config patch to include the new field in the index

```
<configuration xmlns:patch="http://www.sitecore.net/xmlconfig/">
  <sitecore>
    <contentSearch>
      <configuration type="Sitecore.ContentSearch.ContentSearchConfiguration, Sitecore.ContentSearch">
        <indexes hint="list:AddIndex">
          <index id="sitecore_analytics_index" >
            <configuration>
              <documentOptions>
                <fields hint="raw:AddComputedIndexField">
                  <field fieldName="Contact.CompletedGoals" 
                         type="GoalCompletionReporting.Business.Search.GoalsCompletedField, GoalCompletionReporting.Business"
                         matchField="type" 
                         matchValue="contact" 
                         separator="" />
                </fields>
              </documentOptions>
            </configuration>
          </index>
        </indexes>
      </configuration>
    </contentSearch>
  </sitecore>
</configuration>
```

After the configuration was included I followed Adam Conn's article on [how to rebuild the Analytics index][3]. This step ensured that previously completed goals were indexed against the contacts that had completed them. Once complete I could then look at the Index using Luke and see the new field was present and populated with the correct data.

Now that the data was present in the index, I created the custom rule used to search the index for the data.

```
public class HasContactCompletedGoal<T> : TypedQueryableStringOperatorCondition<T, IndexedContact> where T : VisitorRuleContext<IndexedContact>
{
    private const string IndexField = "Contact.CompletedGoals";
    private const string ContainsOperatorId = "{2E67477C-440C-4BCA-A358-3D29AED89F47}";

    public HasContactCompletedGoal()
    {
        OperatorId = ContainsOperatorId;
    }

    protected override Expression<Func<IndexedContact, bool>> GetResultPredicate(T ruleContext)
    {
        ID valueAsId;
        var parsedValueToId = ID.TryParse(Value, out valueAsId);
        ShortID valueAsShortId;
        var parsedValueToShortId = ShortID.TryParse(Value, out valueAsShortId);

        if (!parsedValueToId && !parsedValueToShortId)
        {
            return c => false;
        }

        if (parsedValueToShortId && valueAsId == (ID)null)
        {
            valueAsId = valueAsShortId.ToID();
        }

        var idConvertedToString = valueAsId.Guid.ToString("N").ToLowerInvariant();
        return GetCompareExpression(c => c[IndexField], idConvertedToString);
    }
}
```

With the rule completed, I created a custom condition item called *'Has Contact Completed Goal'* with the other Segment Builder conditions located at *'/sitecore/system/Settings/Rules/Definitions/Elements/Segment Builder'*

![Customer Segment Builder Rule][4]

Now when I created my Segmented List I could see the new rule listed. I could click on the Rule, select the Goal I wanted to filter by and the list was updated correctly, SUCCESS!

![Segment Builder With Custom Rule][5]

If you want to integrate this functionality into your solution then you can get the code, including a TDS package with the custom Condition item on [GitHub ][6].


[1]: /img/blog-images/defaultrules.png
[2]: /img/blog-images/visitrules.png
[3]: http://www.sitecore.net/learn/blogs/technical-blogs/getting-to-know-sitecore/posts/2014/11/rebuilding-the-sitecore-analytics-index.aspx
[4]: /img/blog-images/customrule.png
[5]: /img/blog-images/segmentbuilderwithcustomrule.png
[6]: https://github.com/robearlam/GoalCompletionReporting

