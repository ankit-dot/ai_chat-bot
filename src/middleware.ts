// middleware.js
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next"; // To get cookies

export function middleware(req: NextRequest) {
  const user = getCookie("user", { req }); // Assuming user data is stored in cookies
  const chat = getCookie("chat", { req });
  const url = req.nextUrl.clone();

  // Allow static files and Next.js files to be served
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") || // Next.js files
    url.pathname.startsWith("/static") || // Your static assets
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg)$/) // Other static file types
  ) {
    return NextResponse.next();
  }

  let userData;

  try {
    if (user) {
      userData = JSON.parse(user); // Parse user data if it's in JSON string format
    }
  } catch (e) {
    console.error("Failed to parse user cookie", e);
    userData = null;
  }

  let chatData;
  try {
    if (chat) {
      chatData = JSON.parse(chat); // Parse chat data if it's in JSON string format
    }
  } catch (e) {
    console.error("Failed to parse chat cookie", e);
    chatData = null;
  }
  console.log("user in middleware" + userData);
  console.log("chat in middleware" + chatData);

  // If no user, redirect to the /login page
  if (!userData && url.pathname !== "/login" && url.pathname !== "/register") {
    console.log("Redirecting to /login, no user found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is logged in and trying to access root '/', redirect to user's chat page
  if (userData && url.pathname === "/") {
    console.log("Redirecting to user's chat page");
    return NextResponse.redirect(
      new URL(`/${userData.userId}/new_chat`, req.url)
    );
  }

  // If user is logged in and trying to access a path under their user ID, but not 'new_chat' and not 'dashboard', redirect to 'new_chat'
  if (
    userData &&
    url.pathname.startsWith(`/${userData.userId}`) &&
    !url.pathname.includes("new_chat") &&
    !url.pathname.includes("dashboard") &&
    !url.pathname.includes(chatData) // Exclude '/dashboard' path from this redirection
  ) {
    console.log("Redirecting to new_chat from user path");
    return NextResponse.redirect(
      new URL(`/${userData.userId}/new_chat`, req.url)
    );
  }

  // If user is logged in and tries to access the '/login' page, redirect them to 'new_chat'
  if (userData && url.pathname === "/login") {
    console.log("Redirecting from /login to new_chat");
    return NextResponse.redirect(
      new URL(`/${userData.userId}/new_chat`, req.url)
    );
  }

  // Allow the request to continue if no redirection is needed
  console.log("Continuing request");
  return NextResponse.next();
}
