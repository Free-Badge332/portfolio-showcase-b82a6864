const model = { url: "/room/room.glb" };
const titleFont = { url: "/room/unione.json" };
const subtitleFont = { url: "/room/helvatica.json" };
const screenVideo = { url: "/room/arcane.mp4" };
const bookInner = { url: "/room/book-inner.jpg" };
const logo = { url: "/room/logo.png" };
const adminAndMobile = { url: "/room/adminandmobile.jpg" };
const proshop = { url: "/room/proshop.png" };
const myTeachers = { url: "/room/project-myteachers.webp" };
const wholesale = { url: "/room/project-wholesale.jpg" };
const chatApp = { url: "/room/chatApp.jpg" };
const audio = { url: "/room/audio.png" };

export const roomAssets = {
  model: model.url,
  titleFont: titleFont.url,
  subtitleFont: subtitleFont.url,
  screenVideo: screenVideo.url,
  bookInner: bookInner.url,
  logo: logo.url,
};

export type RoomProject = { image: string; url: string; mobileUrl?: string };

export const roomProjects: RoomProject[] = [
  { image: adminAndMobile.url, url: "https://aregenkibet.web.app", mobileUrl: "https://adminpanel-bx43q6fid-ezadin-badrus-projects.vercel.app/" },
  { image: proshop.url, url: "https://github.com/ezadin2/proshop-demo.git" },
  { image: myTeachers.url, url: "https://abuanwar072.github.io/Flutter-Responsive-Admin-Panel-or-Dashboard/" },
  { image: wholesale.url, url: "https://github.com/ezadin2/Flight-Booking-App-Flutter.git" },
  { image: chatApp.url, url: "https://github.com/ezadin2/nextjs-setup" },
  { image: audio.url, url: "https://github.com/ezadin2/Audio-player.git" },
];
