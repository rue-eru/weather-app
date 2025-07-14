interface HoverCloudProps {
    text: string;
    children: React.ReactNode;
    className?: string
}

const HoverCloud = ({ text, children, className}: HoverCloudProps) =>{
    return (
        <>
          {children}
          <div className={`${className} absolute bottom-full mb-2 hidden group-hover:flex px-3 py-1 bg-white text-black font-extralight rounded shadow-lg whitespace-wrap z-50 transition-opacity duration-200`}>
            {text}
          </div>
        </>
  );
}

export default HoverCloud