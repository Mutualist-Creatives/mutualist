import Image from "next/image";

import Link from "next/link";

const FolderItem = ({
  title,
  images,
  href,
}: {
  title: string;
  images: string[];
  href: string;
}) => {
  return (
    <Link href={href} className="block">
      <div className="group relative w-[130px] h-[150px] md:w-[130px] md:h-[180px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[170px] 2xl:w-[240px] 2xl:h-[200px] cursor-pointer transition-all duration-300 overflow-visible">
        {/* Back of folder */}
        <div className="absolute bottom-0 left-0 z-0 w-full h-full">
          <Image
            src="/assets/home/folder/back.svg"
            alt="Folder Back"
            width={200}
            height={168}
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Photos (Pop out on hover) */}
        {/* Left Paper */}
        <div className="absolute bottom-6 left-2 z-10 w-[110px] h-[80px] md:bottom-10 md:w-[110px] md:h-[80px] lg:bottom-6 lg:w-[160px] lg:h-[110px] xl:bottom-2 xl:w-[180px] xl:h-[130px] 2xl:bottom-2 2xl:w-[220px] 2xl:h-[160px] transition-transform duration-300 ease-out group-hover:-translate-y-8 group-hover:-translate-x-8 group-hover:md:-translate-y-6 group-hover:md:-translate-x-6 group-hover:lg:-translate-y-12 group-hover:lg:-translate-x-12 group-hover:xl:-translate-y-16 group-hover:xl:-translate-x-16 group-hover:2xl:-translate-y-20 group-hover:2xl:-translate-x-20 group-hover:-rotate-12 flex items-center justify-center">
          <Image
            src={images[0]}
            alt={`${title} 1`}
            width={180}
            height={130}
            className="w-full h-full object-contain rounded-sm"
          />
        </div>
        {/* Center Paper */}
        <div className="absolute bottom-6 left-2 z-10 w-[110px] h-[80px] md:bottom-10 md:w-[110px] md:h-[80px] lg:bottom-6 lg:w-[160px] lg:h-[110px] xl:bottom-2 xl:w-[180px] xl:h-[130px] 2xl:bottom-2 2xl:w-[220px] 2xl:h-[160px] transition-transform duration-300 ease-out delay-75 group-hover:-translate-y-10 group-hover:md:-translate-y-8 group-hover:lg:-translate-y-16 group-hover:xl:-translate-y-20 group-hover:2xl:-translate-y-24 flex items-center justify-center">
          <Image
            src={images[1]}
            alt={`${title} 2`}
            width={180}
            height={130}
            className="w-full h-full object-contain rounded-sm"
          />
        </div>
        {/* Right Paper */}
        <div className="absolute bottom-6 left-2 z-10 w-[110px] h-[80px] md:bottom-10 md:w-[110px] md:h-[80px] lg:bottom-6 lg:w-[160px] lg:h-[110px] xl:bottom-2 xl:w-[180px] xl:h-[130px] 2xl:bottom-2 2xl:w-[220px] 2xl:h-[160px] transition-transform duration-300 ease-out delay-100 group-hover:-translate-y-8 group-hover:translate-x-8 group-hover:md:-translate-y-6 group-hover:md:translate-x-6 group-hover:lg:-translate-y-12 group-hover:lg:translate-x-12 group-hover:xl:-translate-y-16 group-hover:xl:translate-x-16 group-hover:2xl:-translate-y-20 group-hover:2xl:translate-x-20 group-hover:rotate-12 flex items-center justify-center">
          <Image
            src={images[2]}
            alt={`${title} 3`}
            width={180}
            height={130}
            className="w-full h-full object-contain rounded-sm"
          />
        </div>

        {/* Front of folder */}
        <div className="absolute bottom-0 left-0 z-20 w-full h-[70%] md:h-[70%] lg:h-[70%]">
          <Image
            src="/assets/home/folder/front.svg"
            alt="Folder Front"
            width={200}
            height={118}
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Label */}
        <div className="absolute -bottom-4 md:-bottom-2 lg:-bottom-10 xl:-bottom-12 2xl:-bottom-14 left-0 w-full text-center">
          <span className="text-sm md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-medium text-purple-mutu whitespace-nowrap">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function FolderSection() {
  const folders = [
    {
      title: "Advertising",
      href: "/services/advertising",
      images: [
        "/assets/home/folder/advertising/1.png",
        "/assets/home/folder/advertising/2.png",
        "/assets/home/folder/advertising/3.png",
      ],
    },
    {
      title: "Branding",
      href: "/services/branding",
      images: [
        "/assets/home/folder/branding/1.png",
        "/assets/home/folder/branding/2.png",
        "/assets/home/folder/branding/3.png",
      ],
    },
    {
      title: "Character",
      href: "/services/character-design",
      images: [
        "/assets/home/folder/character/1.png",
        "/assets/home/folder/character/2.png",
        "/assets/home/folder/character/3.png",
      ],
    },
    {
      title: "Social Media",
      href: "/services/social-media",
      images: [
        "/assets/home/folder/social media/1.png",
        "/assets/home/folder/social media/2.png",
        "/assets/home/folder/social media/3.png",
      ],
    },
  ];

  return (
    <section className="w-full bg-cream-mutu relative z-20">
      <div className="max-w-screen-2xl mx-auto w-full py-20 md:py-24 lg:py-32 xl:py-40 2xl:py-48 flex justify-center items-center px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-12 xl:gap-24 2xl:gap-32 justify-items-center">
          {folders.map((folder, index) => (
            <FolderItem
              key={index}
              title={folder.title}
              images={folder.images}
              href={folder.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
