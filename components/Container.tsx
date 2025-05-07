'use client';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={`mx-auto max-w-[2520px] px-4 sm:px-2 md:px-10 lg:px-8 xl:px-20 ${className || ''}`}
    >
      {children}
    </div>
  );
};

export default Container;
