import { Fragment, useEffect, useState } from "react"; 

interface HoverCloudInlineProps {
    text: string;
    children: React.ReactNode;
    className?: string
    lang?: string; 
}

const HoverCloudInline = ({ text, children, className, lang = "en"}: HoverCloudInlineProps) =>{
    const [ isSmScreen, setIsSmScreen ] = useState(false);

    useEffect (() => {
        const handleResize = () => {
            setIsSmScreen(window.innerWidth < 600)
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

    const getTooltipPosition = () => {
        if (lang === 'ja' && isSmScreen) {
            return {
                className: "left-0 right-auto origin-top-left",
                style: { transform: 'none' }
            };
        }
        return {
            className: "left-1/2 origin-top",
            style: { transform: 'translateX(-50%)' }
        };
    };

    const position = getTooltipPosition();

    return (
        <span className="relative inline-block group">
            <span className={`
                ${className} 
                absolute mt-9 hidden group-hover:block
                p-2 bg-white text-black opacity-200
                text-center font-[450] rounded shadow-lg z-50 
                max-w-xs
                left-1/2 -translate-x-1/2
                hover:left-auto hover:right-0 hover:translate-x-0
                hover:origin-right
                ${isSmScreen ? "whitespace-normal" : "whitespace-nowrap"}
                ${lang === 'ja' && isSmScreen ? 'text-wrap break-keep' : ''}
                ${position.className}
                `}
                style={{
                    // browser fallback
                    ...position.style,
                    ...(lang === 'ja' && {
                        wordBreak: 'keep-all',
                        lineBreak: 'strict'
                    })
                }}
                >
                {lang === 'ja' ? (
                    <>
                    {text.split('\n').map((line, i ) => (
                        <Fragment key={i}>
                            {line}
                            {i < text.split('\n').length - 1 && <br />}
                        </Fragment>
                    ))}
                    </>
                ) : (
                    text
                )} 
            </span>
            {children}
        </span>
  );
}

export default HoverCloudInline