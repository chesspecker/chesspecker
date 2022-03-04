import dynamic from 'next/dynamic';

type Props = {children: React.ReactNode};

/* eslint-disable-next-line react/jsx-no-useless-fragment */
const WithoutSsr = ({children}: Props) => <>{children}</>;

export default dynamic(async () => Promise.resolve(WithoutSsr), {ssr: false});
