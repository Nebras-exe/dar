export interface TabItem { label: string; content?: React.ReactNode; }
export interface TabsProps {
  tabs: TabItem[];
  defaultActive?: number;
}
