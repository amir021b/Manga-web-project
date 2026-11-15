export interface MangaSeedItem {
  id: number;
  title: string;
  japaneseTitle: string;
  author: string;
  status: string;
  genres: string[];
  description: string;
  coverImage: string;
}

const mangaSeedData: MangaSeedItem[] = [
  {
    id: 1,
    title: "One Piece",
    japaneseTitle: "ワンピース",
    author: "Eiichiro Oda",
    status: "Ongoing",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    description: "Follow Monkey D. Luffy and his pirate crew in their search for the ultimate treasure, the One Piece, to become the King of the Pirates.",
    coverImage: "/manga-posters/one-piece-vol-1.jpg"
  },
  {
    id: 2,
    title: "Attack on Titan",
    japaneseTitle: "進撃の巨人",
    author: "Hajime Isayama",
    status: "Completed",
    genres: ["Action", "Dark Fantasy", "Drama", "Shonen"],
    description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
    coverImage: "/manga-posters/attack-on-titan-vol-1.jpg"
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    author: "Gege Akutami",
    status: "Completed",
    genres: ["Action", "Dark Fantasy", "Supernatural", "Shonen"],
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts.",
    coverImage: "/manga-posters/jujutsu-kaisen-vol-1.jpg"
  },
  {
    id: 4,
    title: "Chainsaw Man",
    japaneseTitle: "チェンソーマン",
    author: "Tatsuki Fujimoto",
    status: "Ongoing",
    genres: ["Action", "Dark Fantasy", "Horror", "Shonen"],
    description: "Following a betrayal, a young man left for dead is reborn as a powerful chainsaw-hybrid devil hunter.",
    coverImage: "/manga-posters/chainsaw-man-vol-1.jpg"
  },
  {
    id: 5,
    title: "Fullmetal Alchemist",
    japaneseTitle: "鋼の錬金術師",
    author: "Hiromu Arakawa",
    status: "Completed",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
    coverImage: "/manga-posters/fullmetal-alchemist-vol-1.jpg"
  },
  {
    id: 6,
    title: "Hunter x Hunter",
    japaneseTitle: "HUNTER×HUNTER",
    author: "Yoshihiro Togashi",
    status: "Ongoing",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    description: "Gon Freecss aspires to become a Hunter, an exceptional being capable of tracking down secret treasures, rare beasts, and even other individuals.",
    coverImage: "/manga-posters/hunter-x-hunter-vol-1.jpg"
  },
  {
    id: 7,
    title: "Bleach",
    japaneseTitle: "ブリーチ",
    author: "Tite Kubo",
    status: "Completed",
    genres: ["Action", "Adventure", "Supernatural", "Shonen"],
    description: "High school student Ichigo Kurosaki obtains the powers of a Soul Reaper and must protect humans from evil spirits and guide departed souls.",
    coverImage: "/manga-posters/bleach-vol-1.jpg"
  },
  {
    id: 8,
    title: "Tokyo Ghoul",
    japaneseTitle: "東京喰種トーキョーグール",
    author: "Sui Ishida",
    status: "Completed",
    genres: ["Dark Fantasy", "Horror", "Psychological", "Seinen"],
    description: "A college student is saved by a deadly collision with a ghoul that takes his organs, turning him into a hybrid monster navigating human and ghoul societies.",
    coverImage: "/manga-posters/tokyo-ghoul-vol-1.jpg"
  },
  {
    id: 9,
    title: "Monster",
    japaneseTitle: "モンスター",
    author: "Naoki Urasawa",
    status: "Completed",
    genres: ["Mystery", "Psychological", "Thriller", "Seinen"],
    description: "A brilliant neurosurgeon's life is plunged into chaos after he saves the life of a young boy who turns out to be a psychopathic serial killer.",
    coverImage: "/manga-posters/monster-vol-1.jpg"
  },
  {
    id: 10,
    title: "Akira",
    japaneseTitle: "アキラ",
    author: "Katsuhiro Otomo",
    status: "Completed",
    genres: ["Sci-Fi", "Cyberpunk", "Action", "Seinen"],
    description: "A secret military project endangers Neo-Tokyo when it turns a motorcycle gang member into a rampaging psychic psychopath.",
    coverImage: "/manga-posters/akira-vol-1.jpg"
  },
  {
    id: 11,
    title: "My Hero Academia",
    japaneseTitle: "僕のヒーローアカデミア",
    author: "Kohei Horikoshi",
    status: "Completed",
    genres: ["Action", "Superhero", "Shonen"],
    description: "In a world where people with superpowers (Quirks) are the norm, a boy born without them inherits powers from the world's greatest hero.",
    coverImage: "/manga-posters/my-hero-academia-vol-1.jpg"
  },
  {
    id: 12,
    title: "Dr. STONE",
    japaneseTitle: "Dr.STONE",
    author: "Riichiro Inagaki",
    status: "Completed",
    genres: ["Sci-Fi", "Adventure", "Shonen"],
    description: "After a mysterious phenomenon turns all of humanity to stone, a genius high schooler wakes up and tries to rebuild civilization through the power of science.",
    coverImage: "/manga-posters/dr-stone-vol-1.jpg"
  },
  {
    id: 13,
    title: "Blue Lock",
    japaneseTitle: "ブルーロック",
    author: "Muneyuki Kaneshiro",
    status: "Ongoing",
    genres: ["Sports", "Psychological", "Shonen"],
    description: "Japan's national football team gathers 300 elite high school strikers into a prison-like facility called Blue Lock to create the world's most egotistical striker.",
    coverImage: "/manga-posters/blue-lock-vol-1.jpg"
  },
  {
    id: 14,
    title: "Kaguya-sama: Love Is War",
    japaneseTitle: "かぐや様は告らせたい",
    author: "Aka Akasaka",
    status: "Completed",
    genres: ["Romance", "Comedy", "Psychological", "Seinen"],
    description: "Two elite high school student council members are in love, but too proud to confess first, turning their romance into a psychological mind game.",
    coverImage: "/manga-posters/kaguya-sama-love-is-war-vol-1.jpg"
  },
  {
    id: 15,
    title: "Black Clover",
    japaneseTitle: "ブラッククローバー",
    author: "Yuki Tabata",
    status: "Ongoing",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    description: "A young boy born without magical powers in a magic-dominated world aims to become the Wizard King.",
    coverImage: "/manga-posters/black-clover-vol-1.jpg"
  },
  {
    id: 16,
    title: "A Silent Voice",
    japaneseTitle: "聲の形",
    author: "Yoshitoki Oima",
    status: "Completed",
    genres: ["Drama", "Romance", "Slice of Life", "Shonen"],
    description: "A former school bully seeks redemption by reconnecting with a deaf girl he tormented in elementary school.",
    coverImage: "/manga-posters/a-silent-voice-vol-1.jpg"
  },
  {
    id: 17,
    title: "Berserk",
    japaneseTitle: "ベルセルク",
    author: "Kentaro Miura",
    status: "Ongoing",
    genres: ["Dark Fantasy", "Action", "Adventure", "Seinen"],
    description: "A veteran mercenary turned wanderer, marked for death by demonic forces, embarks on a brutal quest for vengeance against his former friend.",
    coverImage: "/manga-posters/berserk-vol-1.jpg"
  },
  {
    id: 18,
    title: "Vagabond",
    japaneseTitle: "バガボンド",
    author: "Takehiko Inoue",
    status: "Hiatus",
    genres: ["Historical", "Action", "Drama", "Seinen"],
    description: "A fictionalized retelling of the life of legendary swordsman Miyamoto Musashi, tracing his journey from an aggressive youth to an enlightened warrior.",
    coverImage: "/manga-posters/vagabond-vol-1.jpg"
  },
  {
    id: 19,
    title: "Vinland Saga",
    japaneseTitle: "ヴィンランド・サガ",
    author: "Makoto Yukimura",
    status: "Ongoing",
    genres: ["Historical", "Action", "Adventure", "Seinen"],
    description: "A young Viking warrior seeks revenge against his father's killer while getting entangled in political conflicts and discovering the true meaning of peace.",
    coverImage: "/manga-posters/vinland-saga-vol-1.jpg"
  },
  {
    id: 20,
    title: "Death Note",
    japaneseTitle: "デスノート",
    author: "Tsugumi Ohba",
    status: "Completed",
    genres: ["Mystery", "Psychological", "Thriller", "Shonen"],
    description: "An intelligent high school student finds a supernatural notebook that kills anyone whose name is written in it, beginning a crusade to cleanse the world of criminals.",
    coverImage: "/manga-posters/death-note-vol-1.jpg"
  },
  {
    id: 21,
    title: "D.Gray-man",
    japaneseTitle: "D.Gray-man",
    author: "Katsura Hoshino",
    status: "Ongoing",
    genres: ["Action", "Adventure", "Dark Fantasy", "Shonen"],
    description: "An exorcist with an anti-Akuma weapon joins an organization to protect humanity from the Earl of Millennium and his demonic Akuma army.",
    coverImage: "/manga-posters/d-gray-man-vol-1.jpg"
  },
  {
    id: 22,
    title: "Naruto",
    japaneseTitle: "ナルト",
    author: "Masashi Kishimoto",
    status: "Completed",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    description: "An adolescent ninja searches for recognition and dreams of becoming the Hokage, the leader of his village.",
    coverImage: "/manga-posters/naruto-vol-1.jpg"
  },
  {
    id: 23,
    title: "Demon Slayer",
    japaneseTitle: "鬼滅の刃",
    author: "Koyoharu Gotouge",
    status: "Completed",
    genres: ["Action", "Adventure", "Dark Fantasy", "Shonen"],
    description: "A kind-hearted boy becomes a demon slayer after his family is slaughtered and his younger sister is turned into a demon.",
    coverImage: "/manga-posters/demon-slayer-vol-1.jpg"
  }
];

export default mangaSeedData;
