import dynamic from 'next/dynamic';

type Props = {children: React.ReactNode};

/* eslint-disable-next-line react/jsx-no-useless-fragment */
const WithoutSsr = ({children}: Props) => <>{children}</>;

// eslint-disable-next-line import/no-default-export, @typescript-eslint/require-await
export default dynamic(async () => WithoutSsr, {ssr: false});
