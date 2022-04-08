import { PropsWithChildren } from "react";

export default function SiteHeading({ children }: PropsWithChildren<{}>) {
  return <a href="/" className="text-8xl my-8 font-extrabold self-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-purple-600">{children}</a>
}
