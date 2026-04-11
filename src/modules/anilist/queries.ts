// AniList GraphQL query strings
// Simplified from head (gql.tada) to plain template strings for Expo

// --- Fragments ---

export const FULL_MEDIA_LIST_FRAGMENT = `
  fragment FullMediaList on MediaList {
    id
    status
    progress
    repeat
    score(format: POINT_10)
    customLists(asArray: true)
  }
`

export const RELATION_MEDIA_FRAGMENT = `
  fragment RelationMedia on Media {
    id
    status
    format
    episodes
    title { userPreferred }
  }
`

export const MEDIA_EDGE_FRAGMENT = `
  fragment MediaEdgeFrag on MediaEdge {
    relationType(version: 2)
    node {
      ...RelationMedia
      coverImage { extraLarge }
      type
      episodes
      synonyms
      season
      seasonYear
      relations {
        edges {
          relationType(version: 2)
          node {
            ...RelationMedia
            type
            coverImage { extraLarge }
          }
        }
      }
      startDate { year, month, day }
      endDate { year, month, day }
    }
  }
`

export const FULL_MEDIA_FRAGMENT = `
  fragment FullMedia on Media {
    id
    idMal
    title { romaji, english, native, userPreferred }
    description(asHtml: false)
    season
    seasonYear
    format
    status
    episodes
    duration
    averageScore
    genres
    isFavourite
    coverImage { extraLarge, medium, color }
    source
    countryOfOrigin
    isAdult
    bannerImage
    synonyms
    nextAiringEpisode { id, timeUntilAiring, episode }
    startDate { year, month, day }
    trailer { id, site }
    mediaListEntry { ...FullMediaList }
    studios(isMain: true) { nodes { id, name } }
    notaired: airingSchedule(page: 1, perPage: 50, notYetAired: true) {
      n: nodes { a: airingAt, e: episode }
    }
    aired: airingSchedule(page: 1, perPage: 50, notYetAired: false) {
      n: nodes { a: airingAt, e: episode }
    }
    relations { edges { ...MediaEdgeFrag } }
  }
`

export const USER_FRAGMENT = `
  fragment UserFrag on User {
    id
    bannerImage
    about
    isFollowing
    isFollower
    donatorBadge
    options { profileColor }
    createdAt
    name
    avatar { large }
    statistics {
      anime {
        count
        minutesWatched
        episodesWatched
        genres(limit: 3, sort: COUNT_DESC) { genre, count }
      }
    }
  }
`

export const SCHEDULE_MEDIA_FRAGMENT = `
  fragment ScheduleMedia on Media {
    id
    coverImage { extraLarge, color }
    title { userPreferred }
    mediaListEntry { status, progress, id }
    aired: airingSchedule(page: 1, perPage: 50, notYetAired: false) {
      n: nodes { a: airingAt, e: episode }
    }
    notaired: airingSchedule(page: 1, perPage: 50, notYetAired: true) {
      n: nodes { a: airingAt, e: episode }
    }
  }
`

export const THREAD_FRAGMENT = `
  fragment ThreadFrag on Thread {
    id
    title
    body
    userId
    replyCount
    viewCount
    isLocked
    isSubscribed
    isLiked
    likeCount
    repliedAt
    createdAt
    user { ...UserFrag }
    categories { id, name }
  }
`

export const COMMENT_FRAGMENT = `
  fragment CommentFrag on ThreadComment {
    id
    comment
    isLiked
    likeCount
    createdAt
    user { ...UserFrag }
    childComments
    isLocked
  }
`

// --- Queries ---

export const Search = `
  query Search($page: Int, $perPage: Int, $search: String, $genre: [String], $format: [MediaFormat], $status: [MediaStatus], $statusNot: [MediaStatus], $season: MediaSeason, $seasonYear: Int, $isAdult: Boolean, $sort: [MediaSort], $onList: Boolean, $ids: [Int], $nsfw: [String]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      media(type: ANIME, format_not: MUSIC, id_in: $ids, search: $search, genre_in: $genre, format_in: $format, status_in: $status, status_not_in: $statusNot, season: $season, seasonYear: $seasonYear, isAdult: $isAdult, sort: $sort, onList: $onList, genre_not_in: $nsfw) {
        ...FullMedia
      }
    }
  }
  ${FULL_MEDIA_FRAGMENT}
  ${FULL_MEDIA_LIST_FRAGMENT}
  ${MEDIA_EDGE_FRAGMENT}
  ${RELATION_MEDIA_FRAGMENT}
`

export const IDMedia = `
  query IDMedia($id: Int!) {
    Media(id: $id, type: ANIME) {
      ...FullMedia
    }
  }
  ${FULL_MEDIA_FRAGMENT}
  ${FULL_MEDIA_LIST_FRAGMENT}
  ${MEDIA_EDGE_FRAGMENT}
  ${RELATION_MEDIA_FRAGMENT}
`

export const IDTitle = `
  query IDTitle($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title { userPreferred }
    }
  }
`

export const Viewer = `
  query Viewer {
    Viewer {
      ...UserFrag
      mediaListOptions { animeList { customLists } }
      options { titleLanguage, displayAdultContent }
    }
  }
  ${USER_FRAGMENT}
`

export const UserLists = `
  query UserLists($id: Int) {
    MediaListCollection(userId: $id, type: ANIME, forceSingleCompletedList: true, sort: UPDATED_TIME_DESC) {
      user { id }
      lists {
        status
        entries {
          id
          media {
            title { userPreferred }
            id
            status
            mediaListEntry { ...FullMediaList }
            nextAiringEpisode { episode }
            relations { edges { relationType(version: 2), node { id } } }
          }
        }
      }
    }
  }
  ${FULL_MEDIA_LIST_FRAGMENT}
`

export const UpdateUser = `
  mutation UpdateUser($lists: [String], $adult: Boolean, $language: UserTitleLanguage) {
    UpdateUser(animeListOptions: { customLists: $lists }, displayAdultContent: $adult, titleLanguage: $language) {
      id
    }
  }
`

export const Schedule = `
  query Schedule($seasonCurrent: MediaSeason, $seasonYearCurrent: Int, $seasonLast: MediaSeason, $seasonYearLast: Int, $seasonNext: MediaSeason, $seasonYearNext: Int, $onList: Boolean, $ids: [Int], $formatNot: MediaFormat, $nsfw: [String]) {
    curr1: Page(page: 1) {
      media(type: ANIME, season: $seasonCurrent, seasonYear: $seasonYearCurrent, format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
    curr2: Page(page: 2) {
      media(type: ANIME, season: $seasonCurrent, seasonYear: $seasonYearCurrent, format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
    curr3: Page(page: 3) {
      media(type: ANIME, season: $seasonCurrent, seasonYear: $seasonYearCurrent, format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
    residue: Page(page: 1) {
      media(type: ANIME, season: $seasonLast, seasonYear: $seasonYearLast, episodes_greater: 11, format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
    next1: Page(page: 1) {
      media(type: ANIME, season: $seasonNext, seasonYear: $seasonYearNext, sort: [START_DATE], format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
    next2: Page(page: 2) {
      media(type: ANIME, season: $seasonNext, seasonYear: $seasonYearNext, sort: [START_DATE], format_not: $formatNot, onList: $onList, id_in: $ids, genre_not_in: $nsfw) {
        ...ScheduleMedia
      }
    }
  }
  ${SCHEDULE_MEDIA_FRAGMENT}
  ${FULL_MEDIA_LIST_FRAGMENT}
`

export const Following = `
  query Following($id: Int!) {
    Page {
      mediaList(mediaId: $id, isFollowing: true, sort: UPDATED_TIME_DESC) {
        id, status, score, progress
        user { ...UserFrag }
      }
    }
  }
  ${USER_FRAGMENT}
`

export const FollowingMany = `
  query FollowingMany($ids: [Int]!) {
    Page {
      mediaList(mediaId_in: $ids, isFollowing: true, sort: UPDATED_TIME_DESC) {
        id, status, score, progress
        media { id }
        user { ...UserFrag }
      }
    }
  }
  ${USER_FRAGMENT}
`

// --- Mutations ---

export const Entry = `
  mutation Entry($lists: [String], $id: Int!, $status: MediaListStatus, $progress: Int, $repeat: Int, $score: Int) {
    SaveMediaListEntry(mediaId: $id, status: $status, progress: $progress, repeat: $repeat, scoreRaw: $score, customLists: $lists) {
      id
      ...FullMediaList
      media { id }
    }
  }
  ${FULL_MEDIA_LIST_FRAGMENT}
`

export const DeleteEntry = `
  mutation DeleteEntry($id: Int!) {
    DeleteMediaListEntry(id: $id) { deleted }
  }
`

export const ToggleFavourite = `
  mutation ToggleFavourite($id: Int!) {
    ToggleFavourite(animeId: $id) { anime { nodes { id } } }
  }
`

// --- Threads ---

export const Threads = `
  query Threads($id: Int!, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage, total }
      threads(mediaCategoryId: $id, sort: ID_DESC) { ...ThreadFrag }
    }
  }
  ${THREAD_FRAGMENT}
  ${USER_FRAGMENT}
`

export const Thread = `
  query Thread($threadId: Int!) {
    Thread(id: $threadId) { ...ThreadFrag }
  }
  ${THREAD_FRAGMENT}
  ${USER_FRAGMENT}
`

export const Comments = `
  query Comments($threadId: Int, $page: Int) {
    Page(page: $page, perPage: 15) {
      pageInfo { hasNextPage, total }
      threadComments(threadId: $threadId) {
        id, comment, isLiked, likeCount, createdAt
        user {
          id, bannerImage, about, isFollowing, isFollower, donatorBadge
          options { profileColor }
          createdAt, name
          avatar { large }
          statistics { anime { count, minutesWatched, episodesWatched, genres(limit: 3, sort: COUNT_DESC) { genre, count } } }
        }
        childComments
        isLocked
      }
    }
  }
`

export const ToggleLike = `
  mutation ToggleLike($id: Int!, $type: LikeableType!) {
    ToggleLikeV2(id: $id, type: $type) {
      ... on Thread { id, likeCount, isLiked }
      ... on ThreadComment { id, likeCount, isLiked }
    }
  }
`

export const SaveThreadComment = `
  mutation SaveThreadComment($id: Int, $threadId: Int, $parentCommentId: Int, $comment: String) {
    SaveThreadComment(id: $id, threadId: $threadId, parentCommentId: $parentCommentId, comment: $comment) {
      ...CommentFrag
    }
  }
  ${COMMENT_FRAGMENT}
  ${USER_FRAGMENT}
`

export const DeleteThreadComment = `
  mutation DeleteThreadComment($id: Int) {
    DeleteThreadComment(id: $id) { deleted }
  }
`

export const RecursiveRelations = `
  query RecursiveRelations($ids: [Int]!) {
    Page {
      pageInfo { hasNextPage }
      media(id_in: $ids, type: ANIME) {
        ...RelationMedia
        relations {
          edges {
            relationType
            node {
              type
              ...RelationMedia
              relations {
                edges {
                  relationType
                  node { type, ...RelationMedia }
                }
              }
            }
          }
        }
      }
    }
  }
  ${RELATION_MEDIA_FRAGMENT}
`
