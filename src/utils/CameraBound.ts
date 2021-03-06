import {CameraBound, ContentMode, contentModeScale, contentModeAspectFit, contentModeAspectFill, contentModeAspectFillScale, contentModeAspectFitScale, contentModeAspectFitSpace} from "white-web-sdk";
import {NumberType} from "./tools";

// Android 使用 enum 名称，请勿随意改动
enum ScaleMode  {
    Scale,
    AspectFit,
    AspectFitScale,
    AspectFitSpace,
    AspectFill,
    AspectFillScale,
}

type ScaleModeKey = keyof typeof ScaleMode;

type ContentModeType = {
    mode: ScaleMode | ScaleModeKey;
    scale?: number;
    space?: number;
};

type NumberCameraBound = NumberType<CameraBound>;

/** 移除掉两个方法属性，使用自定义类替换 */
export type NativeCameraBound = NumberCameraBound & {
    maxContentMode?: ContentModeType;
    minContentMode?: ContentModeType;
};

export function convertToBound(nativeBound?: NativeCameraBound): CameraBound | undefined {
    if (!nativeBound) {
        return undefined;
    }
    return {
        centerX: nativeBound.centerX,
        centerY: nativeBound.centerY,
        width: nativeBound.width,
        height: nativeBound.height,
        maxContentMode: convertToContentMode(nativeBound.maxContentMode),
        minContentMode: convertToContentMode(nativeBound.minContentMode),
    };
}

function convertToContentMode(modeType?: ContentModeType): ContentMode | undefined {
    if (!modeType) {
        return undefined;
    }
    const scale = modeType.scale ? modeType.scale : 1.0;
    const space = modeType.space ? modeType.space : 0;

    let scaleMode = ScaleMode.Scale;
    // Android 传 string 比较方便，gson 传数字太繁琐
    if (typeof modeType.mode === "string") {
        scaleMode = parseInt(ScaleMode[modeType.mode as string]);
    } else {
        scaleMode = modeType.mode;
    }
    switch (scaleMode) {
        case ScaleMode.Scale:
            return contentModeScale(scale);
        case ScaleMode.AspectFill:
            return contentModeAspectFill();
        case ScaleMode.AspectFillScale:
            return contentModeAspectFillScale(scale);
        case ScaleMode.AspectFit:
            return contentModeAspectFit();
        case ScaleMode.AspectFitScale:
            return contentModeAspectFitScale(scale);
        case ScaleMode.AspectFitSpace:
            return contentModeAspectFitSpace(space);
        default:
            return undefined;
    }
}