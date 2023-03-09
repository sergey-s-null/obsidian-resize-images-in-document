export interface ImageResizeService {
	resize(imagePaths: string[], width: number): void;

	resize(imagePath: string, width: number): void;
}
