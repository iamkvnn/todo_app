import { Plus, Search, ArrowUpDown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ControlPanelProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: 'active' | 'completed' | undefined;
  setStatusFilter: (val: 'active' | 'completed' | undefined) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  setPage: (page: number) => void;
  openCreateDialog: () => void;
}

const sortOptions: Record<string, string> = {
  'createdAt:desc': 'Mới nhất trước',
  'createdAt:asc': 'Cũ nhất trước',
  'title:asc': 'Tiêu đề (A-Z)',
  'title:desc': 'Tiêu đề (Z-A)',
  'status:asc': 'Chưa làm trước',
  'status:desc': 'Đã làm trước',
};

export function ControlPanel({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  setPage,
  openCreateDialog,
}: ControlPanelProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md border-slate-100 dark:border-slate-800 mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Tabs for filters */}
          <Tabs 
            value={statusFilter || 'all'} 
            onValueChange={(val) => {
              setStatusFilter(val === 'all' ? undefined : (val as 'active' | 'completed'));
              setPage(1);
            }}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs md:text-sm font-medium">Tất cả</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg text-xs md:text-sm font-medium">Đang chạy</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg text-xs md:text-sm font-medium">Hoàn thành</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1 bg-slate-50/50 dark:bg-slate-950/50">
              <ArrowUpDown className="size-4 text-slate-400 shrink-0" />
              <Select value={sortBy} onValueChange={(val) => {
                if (val) {
                  setSortBy(val);
                  setPage(1);
                }
              }}>
                <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-8 text-xs font-semibold focus-visible:ring-0 shadow-none w-[160px]">
                  <SelectValue>{sortOptions[sortBy] || 'Sắp xếp theo'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Mới nhất trước</SelectItem>
                  <SelectItem value="createdAt:asc">Cũ nhất trước</SelectItem>
                  <SelectItem value="title:asc">Tiêu đề (A-Z)</SelectItem>
                  <SelectItem value="title:desc">Tiêu đề (Z-A)</SelectItem>
                  <SelectItem value="status:asc">Chưa làm trước</SelectItem>
                  <SelectItem value="status:desc">Đã làm trước</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={openCreateDialog}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/10 font-medium text-sm flex items-center justify-center gap-1.5 h-10 px-4"
            >
              <Plus className="size-4" /> Thêm công việc
            </Button>
          </div>

        </div>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm công việc theo từ khóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 py-2.5 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
