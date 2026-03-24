import { MonthlyArchivePanel } from "@/components/blog/monthly-archive-panel";
import { TopTagsPanel } from "@/components/blog/top-tags-panel";
import { getMonthlyArchive, getTopTags } from "@/lib/blog/posts";

type BlogSidebarProps = {
  activeTag?: string;
};

const TOP_TAG_LIMIT = 10;

export async function BlogSidebar({ activeTag }: BlogSidebarProps) {
  const [tags, archiveEntries] = await Promise.all([getTopTags(TOP_TAG_LIMIT), getMonthlyArchive()]);

  return (
    <aside aria-label="Blog navigation" className="hidden md:block">
      <div className="space-y-4">
        <TopTagsPanel tags={tags} activeTag={activeTag} />
        <MonthlyArchivePanel entries={archiveEntries} />
      </div>
    </aside>
  );
}