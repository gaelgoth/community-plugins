/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { DateTime } from 'luxon';
import { Link } from '@backstage/core-components';
import {
  IndexableDocument,
  ResultHighlight,
} from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';
import { useAnnouncementsTranslation } from '@backstage-community/plugin-announcements-react';
import { Flex, List, ListRow, Text } from '@backstage/ui';
import { RiMegaphoneLine } from '@remixicon/react';

type IndexableAnnouncement = IndexableDocument & {
  createdAt: string;
};

/** @public */
export interface AnnouncementSearchResultProps {
  result?: IndexableDocument;
  highlight?: ResultHighlight;
  rank?: number;
}

export const AnnouncementSearchResultListItem = ({
  result,
  highlight,
}: AnnouncementSearchResultProps) => {
  const { t } = useAnnouncementsTranslation();

  if (!result) {
    return null;
  }

  const document = result as IndexableAnnouncement;

  const title = (
    <Link noTrack to={result.location}>
      {highlight?.fields.title ? (
        <HighlightedSearchResultText
          text={highlight.fields.title}
          preTag={highlight.preTag}
          postTag={highlight.postTag}
        />
      ) : (
        result.title
      )}
    </Link>
  );

  const excerpt = (
    <>
      <Text
        as="span"
        style={{
          display: 'block',
          marginTop: '0.2rem',
          marginBottom: '0.8rem',
        }}
      >
        {`${t('announcementSearchResultListItem.published')} `}
        <Text as="span" title={document.createdAt}>
          {DateTime.fromISO(document.createdAt).toRelative()}
        </Text>
      </Text>
      <>
        {highlight?.fields.text ? (
          <HighlightedSearchResultText
            text={highlight.fields.text}
            preTag={highlight.preTag}
            postTag={highlight.postTag}
          />
        ) : (
          result.text
        )}
      </>
    </>
  );

  return (
    <List aria-label={t('announcementSearchResultListItem.announcement')}>
      <ListRow
        id={result.location}
        icon={<RiMegaphoneLine />}
        textValue={result.title}
      >
        <Flex direction="column" style={{ wordBreak: 'break-all' }}>
          <Text variant="title-small">{title}</Text>
          <Text
            as="span"
            variant="body-small"
            color="secondary"
            style={{ lineHeight: '1.55' }}
          >
            {excerpt}
          </Text>
        </Flex>
      </ListRow>
    </List>
  );
};
