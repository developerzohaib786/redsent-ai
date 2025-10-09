// testimonials.data.ts
export interface Testimonial {
  id: number;
  username: string;
  timeAgo: string;
  content: string;
  avatar: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    username: 'TrulyDaemon',
    timeAgo: '4d ago',
    content: 'Wanted to give you a big thanks! My laptop backlight gave out on a consultant laptop and I urgently needed an extended screen to be able to keep working while traveling. Your guide saved me from a few hours of Reddit research!',
    avatar: 'TD'
  },
  {
    id: 2,
    username: 'HovercraftLow6610',
    timeAgo: '2mo ago',
    content: 'Most useful thing. I agree that Google results are crappy. These days I\'m using the keywords reddit in the end for the Google search to get good answers. Previously it was quora. Now it turned into shit. Reddit based Google search engine. I hope if you can do it then it\'s a big win for many people.',
    avatar: 'HL'
  },
  {
    id: 3,
    username: 'greenappletree',
    timeAgo: '2mo ago',
    content: 'this is so cool OP - < 2 mins I found a monitor that should work for me - I\'m going to bookmark this so I can click via your site when I ready to buy -- great idea too.',
    avatar: 'GA'
  },
  {
    id: 4,
    username: 'nevvyong',
    timeAgo: '3mo ago',
    content: 'Sharing it here in case it helps somebody with their research. this is super helpful, thank you!',
    avatar: 'NY'
  },
  {
    id: 5,
    username: 'j0be',
    timeAgo: '4d ago',
    content: 'I\'d be stoked if you had a similar site for r/AndroidPhones or r/MobilePhones',
    avatar: 'JB'
  }
];

export const testimonialConfig = {
  title: 'Fans of RedditRecs',
  subtitle: 'See what our community members are saying',
  primaryColor: '#FF5F1F',
  backgroundColor: 'white'
};