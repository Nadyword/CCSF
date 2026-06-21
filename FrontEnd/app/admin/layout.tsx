import { DataProvider } from '@/contexts/data-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DataProvider>{children}</DataProvider>
}
