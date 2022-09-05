declare namespace NodeJS {
  export interface ProcessEnv {
    EMAIL_FROM: string;
    EMAIL_SERVER: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    MONGODB_URI: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_AVATARS: string;
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ITEMS: string;
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
  }
}
