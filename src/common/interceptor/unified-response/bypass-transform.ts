import { SetMetadata } from '@nestjs/common';

const BYPASS_TRANSFORM_KEY = 'bypassTransform';
const BypassTransform = () => SetMetadata(BYPASS_TRANSFORM_KEY, true);

export { BYPASS_TRANSFORM_KEY, BypassTransform };
