import type { Schema } from 'mongoose';

const globalTransformPlugin = (schema: Schema) => {
  const isToJsonDefined = !!schema.options.toJSON;
  if (!isToJsonDefined) {
    schema.set('toJSON', {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        return ret;
      },
    });
  }
};

export { globalTransformPlugin };
