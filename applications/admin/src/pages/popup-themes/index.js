import Head from 'next/head';
import { useRouter } from 'next/router';
import { Skeleton } from '@material-ui/lab';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Loader } from '@greatupsells/react-components';
import { Layout, PopupThemeList } from '../../components';
import { usePopupThemes, usePopupTheme } from '../../hooks';

const LoadingComponent = () => (
  <>
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
  </>
);

const ErrorComponent = () => <p>Unable to load popup themes.</p>;

const PopupThemesPage = () => {
  const router = useRouter();

  const {
    popupThemes,
    popupThemesLoading,
    popupThemesError
  } = usePopupThemes();
  const { clonePopupTheme } = usePopupTheme();

  const handleClonePopupTheme = async (popupTheme) => {
    const clonedPopupTheme = await clonePopupTheme(popupTheme);
    router.push(`/popup-themes/${clonedPopupTheme._id}`);
  };

  return (
    <>
      <Head>
        <title>Popup Themes</title>
      </Head>
      <Layout title="Popup Themes" icon={<PopupThemesIcon />}>
        <Loader
          isLoading={popupThemesLoading}
          isError={!!popupThemesError}
          loadingComponent={LoadingComponent}
          errorComponent={ErrorComponent}
        >
          <PopupThemeList
            popupThemes={popupThemes}
            onClonePopupTheme={handleClonePopupTheme}
          />
        </Loader>
      </Layout>
    </>
  );
};

export default PopupThemesPage;
