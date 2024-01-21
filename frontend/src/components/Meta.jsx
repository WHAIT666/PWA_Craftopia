import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Bem-Vindo à Craftopia',
  description: 'Vendemos produtos artesanais de qualidade',
  keywords: 'telemóveis, comprar telemóveis, smartphones, barro',
};

export default Meta;