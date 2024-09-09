import React, { useRef, useState, ReactNode } from 'react';

interface DiagramContainerProps {
    children: ReactNode;
}

const DiagramContainer: React.FC<DiagramContainerProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const handleWheel = (event: React.WheelEvent) => {
        event.preventDefault();
        const newScale = Math.min(Math.max(0.5, scale + event.deltaY * -0.001), 2);
        setScale(newScale);
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        let target = event.target as HTMLElement;
        while (target && target !== containerRef.current) {
            if (target.classList.contains('bi') && !target.classList.contains('bi-diagram')) {
                return;
            }
            target = target.parentElement as HTMLElement;
        }

        event.preventDefault();
        const startX = event.clientX - translate.x;
        const startY = event.clientY - translate.y;

        const onMouseMove = (moveEvent: MouseEvent) => {
            setTranslate({
                x: moveEvent.clientX - startX,
                y: moveEvent.clientY - startY,
            });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div
            ref={containerRef}
            className="h-full overflow-hidden no-select"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            style={{
                cursor: 'grab',
            }}
        >
            <div
                style={{
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default DiagramContainer;