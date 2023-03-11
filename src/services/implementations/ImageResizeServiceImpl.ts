import { ImageResizeService } from "../ImageResizeService";
import { im } from "../../image_magick/im";
import { ImageResizeResult } from "../../entities/ImageResizeResult";
import { ImagesBatchResizeResult } from "../../entities/ImagesBatchResizeResult";
import { injectable } from "inversify";

@injectable()
export class ImageResizeServiceImpl implements ImageResizeService {
	public async resizeBatch(imagePaths: string[], width: number): Promise<ImagesBatchResizeResult> {
		const promises = imagePaths.map((x => this.resize(x, width)));
		const results = await Promise.all(promises);
		return { results };
	}

	public async resize(imagePath: string, width: number): Promise<ImageResizeResult> {
		try {
			const currentWidth = await this.getWidth(imagePath);
			if (currentWidth == width) {
				return { imagePath, result: "skipped" };
			}
		} catch (err) {
			return { imagePath, result: err };
		}

		return await new Promise<ImageResizeResult>(resolve => {
			im(imagePath)
				.resize(width)
				.write(imagePath, error => {
					if (error) {
						resolve({ imagePath, result: error });
					} else {
						resolve({ imagePath, result: "ok" });
					}
				});
		})
	}

	private getWidth(imagePath: string) {
		return new Promise<number>((resolve, reject) => {
			im(imagePath)
				.identify((err, value) => {
					if (err) {
						reject(err);
					} else {
						resolve(value.size.width);
					}
				})
		})
	}
}
