import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PHOTO_URL =
  "https://res.cloudinary.com/umxjpowx/image/upload/v1785082721/AAFuWkQu2jM_1724670310462_jnsj7m.jpg";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 48,
          padding: "0 64px",
          background: "#121214",
          color: "#ececee",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={PHOTO_URL}
          width={280}
          height={280}
          style={{ borderRadius: "50%", border: "4px solid #4a8fe0", objectFit: "cover" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 56, fontWeight: 700 }}>DJEMAI Mohamed Erraid</div>
          <div style={{ fontSize: 32, color: "#8a8a8e", marginTop: 8 }}>
            Full-Stack Developer
          </div>
          <div style={{ fontSize: 24, color: "#4a8fe0", marginTop: 20, fontFamily: "monospace" }}>
            GET /api/home -&gt; 200 OK
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}