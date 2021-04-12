import { useRouter } from 'next/router';
import { Breadcrumbs, Hidden, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const LoadingComponent = () => (
  <>
    <Typography component="div" variant="h1">
      <Skeleton />
    </Typography>
    <Skeleton variant="rect" width="100%" height={200} />
  </>
);

const ErrorComponent = () => <p>Unable to load popup theme.</p>;

const EditPopupThemePage = () => {
  const router = useRouter();
  const popupThemeId = router.query.id;

  const {
    popupTheme,
    popupThemeError,
    popupThemeLoading,
    savePopupTheme
  } = usePopupTheme(popupThemeId);

  const handleSubmit = async (values) => {
    await savePopupTheme(values);
  };

  return (
    <Layout
      title={
        <>
          <Hidden xsDown>
            <Breadcrumbs>
              <Link href="/popup-themes">Popup Themes</Link>
              <span>New Popup Theme</span>
            </Breadcrumbs>
          </Hidden>
          <Hidden smUp>
            <span>Edit Popup Theme</span>
          </Hidden>
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <Loader
        isLoading={popupThemeLoading}
        isError={!!popupThemeError}
        loadingComponent={LoadingComponent}
        errorComponent={ErrorComponent}
      >
        <PopupThemeEditor initialValues={popupTheme} onSubmit={handleSubmit} />
      </Loader>
    </Layout>
  );
};

export default EditPopupThemePage;
