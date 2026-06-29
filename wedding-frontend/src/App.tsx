import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Overview } from './features/dashboard/Overview';
import { MyCards } from './features/dashboard/MyCards';
import { Templates } from './features/templates/Templates';
import { Wishes } from './features/dashboard/Wishes';
import { RSVP } from './features/dashboard/RSVP';
import { ReceivedGifts } from './features/dashboard/ReceivedGifts';
import { AccountProfile } from './features/dashboard/AccountProfile';
import { MyPlan } from './features/dashboard/MyPlan';
import { WeddingCanvasEditor } from './features/editor/WeddingCanvasEditor';
import { PublicCardViewer } from './features/public-card/PublicCardViewer';
import { PaymentQR} from './features/dashboard/Paymentqr';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />

        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/my-cards" element={<MyCards />} />
        <Route path="/dashboard/templates" element={<Templates />} />
        <Route path="/dashboard/wishes" element={<Wishes />} />
        <Route path="/dashboard/rsvp" element={<RSVP />} />
        <Route path="/dashboard/gifts" element={<ReceivedGifts />} />
        <Route path="/dashboard/account" element={<AccountProfile />} />
        <Route path="/dashboard/plan" element={<MyPlan />} />
        <Route path="/dashboard/payment" element={<PaymentQR />} />
        <Route path="/editor" element={<WeddingCanvasEditor />} />
        <Route path="/thiep/:slug" element={<PublicCardViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;