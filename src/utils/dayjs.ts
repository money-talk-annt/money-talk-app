import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/vi";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export default dayjs;