import { Routes, Route, Link } from "react-router-dom";

import NoteContextProvider from "./context/NoteContext";
import EditNotes from "./pages/EditNotes";
import Auth from "./pages/Auth";
import Home from "./pages/Home";

export default function App() {
  return (
    <NoteContextProvider>
      <Routes>
        <Route path="/">
          <Route index element={<Auth />} />
          <Route path=":user" element={<Home />} />
          <Route path=":user/:noteId" element={<EditNotes />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </NoteContextProvider>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
