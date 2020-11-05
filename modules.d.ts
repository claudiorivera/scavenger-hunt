declare namespace NodeJS {
  export interface ProcessEnv {
    CLOUDINARY_BASE_URL: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_UPLOAD_PRESET_AVATARS: string;
    CLOUDINARY_UPLOAD_PRESET_ITEMS: string;
    EMAIL_FROM: string;
    EMAIL_SERVER: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    MONGODB_URI: string;
    NEXTAUTH_URL: string;
    SECRET: string;
  }
}
