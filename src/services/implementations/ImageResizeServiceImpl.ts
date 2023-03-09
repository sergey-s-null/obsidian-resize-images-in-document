import { ImageResizeService } from "../ImageResizeService";
import { im } from "../../image_magick/im";
import { ImageResizeResult } from "../../entities/ImageResizeResult";
import { ImagesBatchResizeResult } from "../../entities/ImagesBatchResizeResult";

export class ImageResizeServiceImpl implements ImageResizeService {
	public async resizeBatch(imagePaths: string[], width: number): Promise<ImagesBatchResizeResult> {
		const promises = imagePaths.map((x => this.resize(x, width)));
		const results = await Promise.all(promises);
		return { results };
	}

	public resize(imagePath: string, width: number): Promise<ImageResizeResult> {
		return new Promise<ImageResizeResult>(resolve => {
			im(imagePath)
				.resize(width)
				.write(imagePath, error => {
					if (error) {
						resolve({ imagePath, error });
					} else {
						resolve({ imagePath, error: null });
					}
				});
		})
	}
}
