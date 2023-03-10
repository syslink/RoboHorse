import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { XNFTs } from 'components/templates/xenExtension/xNFT';
import Moralis from 'moralis';

const XNFTPage: NextPage<any> = (props) => {
  return (
    <Default pageName="XNFT Information">
      <XNFTs {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  if (!session?.user.address) {
    return { props: { error: 'Connect your wallet first' } };
  }

  const balances = await Moralis.EvmApi.account.getNFTs({
    address: session?.user.address,
    chain: process.env.APP_CHAIN_ID,
  });

  // (balances.result).filter((balance)=> balance.result.)

  return {
    props: {
      balances: JSON.parse(JSON.stringify(balances.result)),
    },
  };
};

export default XNFTPage;
