# Display a banner for the latest announcement

Adding the `NewAnnouncementBanner` component to a page will display a banner with the title and excerpt of the latest unseen announcement. This banner will update in near real-time when a new announcement is created if your Backstage instance is configured to support signals.

**Note:** if there are no announcements or the latest announcement has already been seen by the user, nothing will be displayed.

```ts
import { NewAnnouncementBanner } from '@backstage-community/plugin-announcements';

export const HomePage = () => {
  return (
    <Page themeId="home">
      <Header title="NewAnnouncementBanner" />

      <Content>
        <Grid container>
          <Grid item md={12}>
            <NewAnnouncementBanner />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
```
