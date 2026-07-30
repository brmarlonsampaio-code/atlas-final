import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import Timeline from '@/components/Timeline';
import DocumentViewer from '@/components/DocumentViewer';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';
import UserPanel from '@/components/UserPanel';
import LocationDetailsPanel from '@/components/LocationDetailsPanel';
import SmartLegend from '@/components/SmartLegend';
import { MapProvider } from '@/context/MapContext';

export default function Home() {
  return (
    <MapProvider>
      <main className="relative w-screen h-screen overflow-hidden bg-black text-white selection:bg-blue-500/30">
        <Map />
        <Sidebar />
        <SmartLegend />
        <LocationDetailsPanel />
        <Dashboard />
        <UserPanel />
        <Timeline />
        <DocumentViewer />
        <AdminPanel />
      </main>
    </MapProvider>
  );
}
