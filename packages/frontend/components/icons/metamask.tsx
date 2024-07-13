import Image from "next/image";

const Metamask = (props: any) => (
  <Image
    {...props}
    src="/metamask.png"
    alt="metamask icon"
    priority
    style={{
      width: "auto",
      height: "auto",
    }}
  />
);
export default Metamask;
