// @ts-nocheck -- full-screen home based on Ezadin's 3D room portfolio
import { useEffect, useRef, useState } from "react";
import { createRoom } from "../room/roomScene";
import "./styles/Room.css";

const links = [
  { label: "Full portfolio", href: "/portfolio" },
  { label: "Skills & services", href: "/portfolio#what-heading" },
  { label: "Experience", href: "/portfolio#career" },
  { label: "Work", href: "/portfolio#work" },
  { label: "Certificates", href: "/portfolio#certificates" },
  { label: "Contact", href: "/portfolio#contact" },
];

const RoomHome = () => {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const api = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dark, setDark] = useState(false);
  const [choice, setChoice] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const room = createRoom(wrap.current, canvas.current, {
      onLoaded: () => setLoaded(true),
      onFocusChange: setFocused,
      onThemeChange: (t) => setDark(t === "dark"),
      onChooseProject: setChoice,
    });
    api.current = room;
    return () => room.dispose();
  }, []);

  return (
    <div className={`room-home ${dark ? "room-dark" : ""}`}>
      <div className="room-stage room-full" ref={wrap}>
        <canvas ref={canvas} className="room-canvas" />
        {!loaded && <div className="room-loading">Loading room…</div>}
      </div>
      <header className="room-top">
        <a href="/" className="room-logo">Ezadin<span>.</span></a>
        <button className="room-menu-btn" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <nav className={`room-side ${open ? "open" : ""}`}>
        {focused ? (
          <button onClick={() => api.current?.reset()}>← Back to room</button>
        ) : (
          <>
            <button onClick={() => { api.current?.showAbout(); setOpen(false); }}>About me</button>
            <button onClick={() => { api.current?.showProjects(); setOpen(false); }}>Projects</button>
          </>
        )}
        {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        <a href="mailto:ezadinbadru55@gmail.com">Email me</a>
        <a href="https://www.linkedin.com/in/ezadin-badiru-966643331/" target="_blank" rel="noopener">LinkedIn</a>
      </nav>
      <p className="room-hint">Drag to look around · click the book, the light switch or a project screen</p>
      {choice && (
        <div className="room-choice" onClick={() => setChoice(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <p>Which version would you like to open?</p>
            <a href={choice.url} target="_blank" rel="noopener">Web</a>
            <a href={choice.mobileUrl} target="_blank" rel="noopener">Mobile / Admin</a>
            <button onClick={() => setChoice(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomHome;
