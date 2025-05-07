'use client';

interface HeadingProps {
  title: string;
  subtitle: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <h2 className="text-md font-bold md:text-xl">{title}</h2>
      <p className="md:text-md text-sm font-light">{subtitle}</p>
    </div>
  );
};

export default Heading;
