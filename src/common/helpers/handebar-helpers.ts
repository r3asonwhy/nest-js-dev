import moment from 'moment';

export const helpers = {
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      case 'includes':
        return v1 && v1.includes(v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
  isLastElement(array, element) {
    if (!array.length) return '';
    const lastElement = array[array.length - 1];

    if (lastElement === element) {
      return '';
    } else return ',';
  },
  stringifyOrParse(data, flag) {
    if (flag == 1) {
      return JSON.stringify(data);
    } else {
      return JSON.parse(data);
    }
  },
  formatDateTime: function (str, type) {
    let date;
    if (type === 1) {
      date = moment(str).format('DD.MM.YYYY');
    } else if (type === 2) {
      date = moment(str).format('DD.MM.YYYY, HH:mm');
    } else if (type === 3) {
      date = moment(str).format('DD.MM.YYYY');
    } else if (type === 4) {
      date = moment(str).format('DD MMM HH:mm');
    } else if (type === 5) {
      date = moment(str).format('DD MMMM YYYY');
    } else if (type === 6) {
      date = moment(str).format('DD MMM HH:mm');
    } else if (type === 7) {
      date = moment(str).format('MMMM YYYY');
    } else date = moment(str).format('DD.MM.YYYY, HH:mm:ss');

    return date;
  },
  formatChatDateTime: function (str) {
    const time = moment(str).format('HH:mm');
    return time;
  },
  getYear: function () {
    return new Date().getFullYear();
  },
  makePropertyAlt: function (name: string, count?: number): string {
    return count >= 0 ? `${name} - №${count + 1}` : `${name}`;
  },
  switch: function (value, options) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
  },
  case: function (value, options) {
    if (value == this.switch_value) {
      this.switch_break = true;
      return options.fn(this);
    }
  },
  default: function (value, options) {
    if (this.switch_break == false) {
      return value;
    }
  },
  imageAlt: function (image) {
    return image && image.alt_text ? image.alt_text : '';
  },
  setImageOrVideoType: function (contentType, filename) {
    let current_file_extansion;
    if (filename)
      current_file_extansion = filename.slice(
        (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1
      );
    if (contentType == 'image') {
      return `image/${current_file_extansion}`;
    } else if (contentType == 'video') {
      return `video/${current_file_extansion}`;
    }
  },
  documentPath: function (docmuent) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    if (docmuent) {
      if (docmuent.type) {
        result = `${baseUrl}/uploads/${docmuent.type}/original/${docmuent.filename}`;
      } else {
        result = `${baseUrl}/uploads/${docmuent.filename}`;
      }
    } else {
      result = `${baseUrl}/img/placeholder.png`;
    }
    return result;
  },
  propertyNameFormat: function (name: string) {
    return name;
  },
  imagePath: function (image, cropFolder, type?: string) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    let current_file_extansion;
    if (image && image.filename)
      current_file_extansion = image.filename.slice(
        (Math.max(0, image.filename.lastIndexOf('.')) || Infinity) + 1
      );

    if (image && cropFolder) {
      if (image.type) {
        result = `${baseUrl}/uploads/${
          image.type ? image.type : ''
        }/${cropFolder}/${image.filename}`;
      } else {
        result = `${baseUrl}/uploads/${image.filename}`;
      }
    } else if (image && !cropFolder) {
      if (image.type) {
        result =
          current_file_extansion == 'svg'
            ? `${baseUrl}/uploads/${image.type ? image.type : ''}/original/${
                image.filename
              }`
            : `${baseUrl}/uploads/${image.type ? image.type : ''}/${
                image.filename
              }`;
      } else {
        result =
          current_file_extansion == 'svg'
            ? `${baseUrl}/uploads/original/${image.filename}`
            : `${baseUrl}/uploads/${image.filename}`;
      }
    } else if (type && type === 'avatar') {
      result = `${baseUrl}/img/icons/user/avatar_placeholder.svg`;
    } else {
      result = `${baseUrl}/img/placeholder.png`;
    }
    return result;
  },
  imagePathWebp: function (status, image, cropFolder) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    if (status && image && image.filename_webp) {
      if (image && cropFolder) {
        if (image.type) {
          result = `${baseUrl}/uploads/${
            image.type ? image.type : ''
          }/${cropFolder}/${image.filename_webp}`;
        } else {
          result = `${baseUrl}/uploads/${image.filename_webp}"`;
        }
      } else if (image && !cropFolder) {
        if (image.type) {
          result = `${baseUrl}/uploads/${image.type ? image.type : ''}/${
            image.filename_webp
          }`;
        } else {
          result = `${baseUrl}/uploads/${image.filename_webp}`;
        }
      }
    }
    return result;
  },
  imagePathTasks: function (image, withoutPlaceholder = false) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    let current_file_extansion;
    if (image && image.filename)
      current_file_extansion = image.filename.slice(
        (Math.max(0, image.filename.lastIndexOf('.')) || Infinity) + 1
      );

    if (image) {
      const filename = image.filename_webp
        ? image.filename_webp
        : image.filename;
      if (image.type) {
        result =
          current_file_extansion == 'svg'
            ? `${baseUrl}/uploads/${
                image.type ? image.type : ''
              }/original/${filename}`
            : `${baseUrl}/uploads/${image.type ? image.type : ''}/${filename}`;
      } else {
        result =
          current_file_extansion == 'svg'
            ? `${baseUrl}/uploads/original/${filename}`
            : `${baseUrl}/uploads/${filename}`;
      }
    } else {
      if (!withoutPlaceholder) result = `${baseUrl}/img/placeholder.png`;
    }
    return result;
  },
  formatDateForPost: function (str, lang) {
    const result = '';
    if (str) {
      const date = moment(str).locale(lang).format('MMMM');
      const day = moment(str).date();
      const hours = moment(new Date(str)).format('HH:mm');

      return (
        `${day}` + ' ' + `${date}   <span class="delimiter">|</span> ${hours}`
      );
    }
    return result;
  },
  getItemPosition: function (index: number) {
    return index + 1;
  },
  parsePhone: function (data) {
    let html = '';
    if (data) {
      data = data.split(',');

      for (const i of data) {
        html += `<li><a href="tel:${i}">${i}</a></li>`;
      }
    }
    return html;
  },
  audioPath: function (audio) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    if (audio) {
      if (audio.type) {
        result = `${baseUrl}/uploads/${audio.type}/original/${audio.filename}`;
      } else {
        result = `${baseUrl}/uploads/original/${audio.filename}`;
      }
    }
    return result;
  },
  videoPath: function (video) {
    const baseUrl =
      process.env.ENV && process.env.ENV === 'dev' ? process.env.IMG_URL : '';
    let result = '';
    if (video) {
      if (video.type) {
        result = `${baseUrl}/uploads/${video.type}/original/${video.filename}`;
      } else {
        result = `${baseUrl}/uploads/original/${video.filename}`;
      }
    }
    return result;
  },
  getOriginId: function (obj) {
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
      return obj.origin_id ? obj.origin_id : obj.id;
    } else {
      return null;
    }
  },
};
