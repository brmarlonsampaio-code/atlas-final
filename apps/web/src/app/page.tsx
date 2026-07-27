import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import Timeline from '@/components/Timeline';
import DocumentViewer from '@/components/DocumentViewer';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-blue-500/30">
      <Map />
      <Sidebar />
      <Timeline />
      <DocumentViewer />
    </main>
  );
}
