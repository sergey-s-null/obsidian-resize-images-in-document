import { ImageResizeResult } from "../entities/ImageResizeResult";
import { ImagesBatchResizeResult } from "../entities/ImagesBatchResizeResult";

export interface ImageResizeService {
	resizeBatch(imagePaths: string[], width: number): Promise<ImagesBatchResizeResult>;

	resize(imagePath: string, width: number): Promise<ImageResizeResult>;
}
