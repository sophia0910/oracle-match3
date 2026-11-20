/* 甲骨字库与关卡 · 双文案（童蒙 / 雅士） */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OracleData = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  var CHARS = [
    {
      id: 'ri', glyph: 'sun', kai: '日', pinyin: 'rì', volume: '自然',
      meaning: '太阳',
      logic: '画一个圆圆的太阳，中间点一点，表示太阳有实体。',
      kid: '太阳公公圆圆的，中间有一点亮光。',
      adult: '甲骨「日」多作圆形中加一点或一短横；契刻圆难，亦有作方框者。',
      bone: '贞：今日不雨？',
      gloss: '卜问：今天不会下雨吧？'
    },
    {
      id: 'yue', glyph: 'moon', kai: '月', pinyin: 'yuè', volume: '自然',
      meaning: '月亮',
      logic: '画一弯新月，中间一短画表示月体。',
      kid: '月亮弯弯像小船，中间还画了一道。',
      adult: '甲骨「月」作新月形，与「夕」形近，多据辞例分辨。',
      bone: '月有食',
      gloss: '记月食之事。'
    },
    {
      id: 'shan', glyph: 'mountain', kai: '山', pinyin: 'shān', volume: '自然',
      meaning: '山岳',
      logic: '三座山峰并立，中间一峰最高。',
      kid: '三座山头连在一起，中间那座最高。',
      adult: '甲骨「山」取三峰之形，与「火」形近，火中峰高耸而旁有火星。',
      bone: '燎于山',
      gloss: '在山上行燎祭。'
    },
    {
      id: 'shui', glyph: 'water', kai: '水', pinyin: 'shuǐ', volume: '自然',
      meaning: '水流',
      logic: '中间一道曲折水脉，两旁点缀水花。',
      kid: '中间一道水流，两边溅起小水花。',
      adult: '甲骨「水」作曲折水流，旁加点滴，即后世「氵」之所本。',
      bone: '涉大水',
      gloss: '渡越大河。'
    },
    {
      id: 'mu', glyph: 'tree', kai: '木', pinyin: 'mù', volume: '生物',
      meaning: '树木',
      logic: '一根树干，上面两枝，下面两根。',
      kid: '一棵树：上面两根树枝，下面两条树根。',
      adult: '甲骨「木」上枝下根；「本」加一点于根，「末」加一点于梢。',
      bone: '',
      gloss: '桑、柳、柏诸字皆以木为形旁。'
    },
    {
      id: 'tian', glyph: 'field', kai: '田', pinyin: 'tián', volume: '人造物',
      meaning: '田亩',
      logic: '方框之中纵横划出田埂。',
      kid: '一块方方的田，中间划出小路。',
      adult: '甲骨「田」作方框加十字，象阡陌之界，或作多格以象井田。',
      bone: '王往田',
      gloss: '商王前往田猎。'
    },
    {
      id: 'huo', glyph: 'fire', kai: '火', pinyin: 'huǒ', volume: '自然',
      meaning: '火焰',
      logic: '中间一簇主焰上扬，两旁火星迸散。',
      kid: '火苗呼呼往上蹿，两边还有小火星。',
      adult: '甲骨「火」与「山」形近：火星四出，主焰高而旁焰低。',
      bone: '焚',
      gloss: '「焚」从火从林，烧林而猎。'
    },
    {
      id: 'ren', glyph: 'person', kai: '人', pinyin: 'rén', volume: '人体',
      meaning: '人',
      logic: '画一个侧身站立、垂臂弯腰的人。',
      kid: '一个人侧着身子站着，弯着腰。',
      adult: '甲骨「人」象侧立人形，作偏旁时或省作「亻」。',
      bone: '',
      gloss: '「人」是合体字中最常见的部件之一。'
    },
    {
      id: 'da', glyph: 'big', kai: '大', pinyin: 'dà', volume: '人体',
      meaning: '大',
      logic: '正面站立、张开双臂双腿的人，表示大。',
      kid: '一个人张开双手双脚，好大呀！',
      adult: '甲骨「大」为正面人形，与侧形的「人」相对；「天」「太」由此孳乳。',
      bone: '',
      gloss: '卜辞多借「大」为大小之大。'
    },
    {
      id: 'mueye', glyph: 'eye', kai: '目', pinyin: 'mù', volume: '人体',
      meaning: '眼睛',
      logic: '画一只竖起来的眼睛，中间一点是瞳孔。',
      kid: '一只大眼睛，中间是黑眼珠。',
      adult: '甲骨「目」横目而竖书，中加圆点为瞳；作偏旁后作「罒」。',
      bone: '',
      gloss: '「目」部字多与观看、眼疾相关。'
    },
    {
      id: 'kou', glyph: 'mouth', kai: '口', pinyin: 'kǒu', volume: '人体',
      meaning: '嘴',
      logic: '画一个张开的方口。',
      kid: '张开的小嘴巴，方方的。',
      adult: '甲骨「口」作方框，与围合的「囗」形同而义别。',
      bone: '',
      gloss: '「口」作偏旁多与言语、饮食相关。'
    },
    {
      id: 'yu', glyph: 'rain', kai: '雨', pinyin: 'yǔ', volume: '自然',
      meaning: '下雨',
      logic: '上面一横是天，下面点点是落下的雨。',
      kid: '天上一条线，下面滴滴答答下雨啦。',
      adult: '甲骨「雨」上横象天，下垂雨点，或再加「水」形。',
      bone: '其雨？',
      gloss: '会下雨吗？'
    },
    {
      id: 'yun', glyph: 'cloud', kai: '云', pinyin: 'yún', volume: '自然',
      meaning: '云气',
      logic: '画回旋卷曲的云气。',
      kid: '云朵打着卷儿飘过来。',
      adult: '甲骨「云」作回旋云气之形，后世加「雨」而成「雲」。',
      bone: '兹云其雨？',
      gloss: '这云会下雨吗？'
    },
    {
      id: 'chuan', glyph: 'river', kai: '川', pinyin: 'chuān', volume: '自然',
      meaning: '河流',
      logic: '三条曲线并流，两边是岸，中间是水。',
      kid: '三条小河并排流淌。',
      adult: '甲骨「川」三笔象河流，左右为岸，中为水脉。',
      bone: '涉川',
      gloss: '渡河。'
    },
    {
      id: 'shi', glyph: 'stone', kai: '石', pinyin: 'shí', volume: '自然',
      meaning: '石头',
      logic: '山崖之下放着一块石头。',
      kid: '山崖下面有一块大石头。',
      adult: '甲骨「石」从「厂」（山崖）从石，是会意字。',
      bone: '',
      gloss: '「石」部字多与坚硬、磬声相关。'
    },
    {
      id: 'tu', glyph: 'soil', kai: '土', pinyin: 'tǔ', volume: '自然',
      meaning: '泥土',
      logic: '地面之上隆起一堆土。',
      kid: '地上堆起一个小土包。',
      adult: '甲骨「土」一横为地，上作土块之形，与「社」同源。',
      bone: '',
      gloss: '卜辞「土」亦指社神。'
    },
    {
      id: 'niu', glyph: 'ox', kai: '牛', pinyin: 'niú', volume: '生物',
      meaning: '牛',
      logic: '牛头正面：双角上弯，两耳横张。',
      kid: '牛头上有两只弯弯的角。',
      adult: '甲骨「牛」取牛首正面形，角上翘；「羊」角下卷，以此为别。',
      bone: '牛',
      gloss: '卜辞常记用牛为牲之数。'
    },
    {
      id: 'yang', glyph: 'sheep', kai: '羊', pinyin: 'yáng', volume: '生物',
      meaning: '羊',
      logic: '羊头正面：双角向下卷曲。',
      kid: '小羊的角是弯弯往下卷的。',
      adult: '甲骨「羊」角下卷，与牛角上翘相对，二字皆取首形。',
      bone: '羊',
      gloss: '羊为卜辞常见祭牲。'
    },
    {
      id: 'niao', glyph: 'bird', kai: '鸟', pinyin: 'niǎo', volume: '生物',
      meaning: '鸟',
      logic: '鸟的侧影：尖喙、头、翼、长尾、双爪。',
      kid: '小鸟有尖尖嘴和一片翅膀。',
      adult: '甲骨「鸟」象长尾鸟，「隹」象短尾鸟，二形互补。',
      bone: '',
      gloss: '「鸟」「隹」二部多与禽类相关。'
    },
    {
      id: 'yufish', glyph: 'fish', kai: '鱼', pinyin: 'yú', volume: '生物',
      meaning: '鱼',
      logic: '鱼头、鱼身、鱼鳍、鱼尾俱全。',
      kid: '一条小鱼，摇着尾巴游过来。',
      adult: '甲骨「鱼」头、身、鳍、尾分明，作偏旁时省为「鱼」。',
      bone: '',
      gloss: '卜辞有「其鱼」之辞，问渔获。'
    },
    {
      id: 'zhu', glyph: 'bamboo', kai: '竹', pinyin: 'zhú', volume: '生物',
      meaning: '竹子',
      logic: '两根竹竿并立，节节生叶。',
      kid: '两根竹子，叶子尖尖的。',
      adult: '甲骨「竹」作两竿并立，有节有叶，即「⺮」之源。',
      bone: '',
      gloss: '「竹」部字多与竹器、简册相关。'
    },
    {
      id: 'lin', glyph: 'woods', kai: '林', pinyin: 'lín', volume: '生物',
      meaning: '树林',
      logic: '两棵树并立，就是一片林子。',
      kid: '两棵树站在一起，就是「林」。',
      adult: '甲骨「林」从二木，会木多成林之意，纯会意。',
      bone: '于林',
      gloss: '在林中祭祀。'
    },
    {
      id: 'sen', glyph: 'forest', kai: '森', pinyin: 'sēn', volume: '生物',
      meaning: '森林',
      logic: '三棵树聚在一起，比林更密。',
      kid: '三棵树挤在一起，就是更密的「森」。',
      adult: '甲骨「森」从三木，三表其多，较「林」更繁。',
      bone: '',
      gloss: '「森」字甲骨已见，后世沿用。'
    },
    {
      id: 'ming', glyph: 'bright', kai: '明', pinyin: 'míng', volume: '自然',
      meaning: '明亮',
      logic: '太阳和月亮并照，光明之意。',
      kid: '太阳和月亮一起照亮天空，就是「明」。',
      adult: '甲骨「明」从日从月，或从囧（窗）从月，取光照之义。',
      bone: '',
      gloss: '卜辞「明」多用于「明雨」「明日」之类。'
    },
    {
      id: 'xiu', glyph: 'rest', kai: '休', pinyin: 'xiū', volume: '人体',
      meaning: '休息',
      logic: '一个人靠在树边歇息。',
      kid: '一个人靠在树旁歇脚，就是「休」。',
      adult: '甲骨「休」从人从木，会人依树止息之意。',
      bone: '',
      gloss: '「休」在卜辞中亦有用为美善之义者。'
    },
    {
      id: 'an', glyph: 'peace', kai: '安', pinyin: 'ān', volume: '人造物',
      meaning: '安适',
      logic: '屋子里坐着一个女子，安静安稳。',
      kid: '屋子里面有个女孩子，安安静静。',
      adult: '甲骨「安」从宀从女，会安居之意；或说女坐室中为安。',
      bone: '',
      gloss: '「安」为后世安宁、安好之源。'
    },
    {
      id: 'hao', glyph: 'good', kai: '好', pinyin: 'hǎo', volume: '人体',
      meaning: '美好',
      logic: '一个女子抱着孩子，是美好的图景。',
      kid: '妈妈抱着小宝宝，真好。',
      adult: '甲骨「好」从女从子，会美善之意；或说生育为美。',
      bone: '',
      gloss: '「好」有美好、亲爱之义。'
    },
    {
      id: 'she', glyph: 'wade', kai: '涉', pinyin: 'shè', volume: '人造物',
      meaning: '涉水',
      logic: '水旁加一只脚，表示踏水过河。',
      kid: '脚踩进水里过河，就是「涉」。',
      adult: '甲骨「涉」从水从止（足），会徒步渡水之意。',
      bone: '涉河',
      gloss: '徒步渡河。'
    },
    {
      id: 'cai', glyph: 'pick', kai: '采', pinyin: 'cǎi', volume: '人造物',
      meaning: '采摘',
      logic: '一只手伸到树上摘取。',
      kid: '伸手到树上摘果子，就是「采」。',
      adult: '甲骨「采」从爪（手）从木，会采摘之意。',
      bone: '',
      gloss: '「采」后引申为采色、采集。'
    },
    {
      id: 'qiu', glyph: 'prison', kai: '囚', pinyin: 'qiú', volume: '人体',
      meaning: '囚禁',
      logic: '一个人被围在方框之中。',
      kid: '一个人被圈起来了，就是「囚」。',
      adult: '甲骨「囚」从人在囗中，会拘禁之意。',
      bone: '',
      gloss: '卜辞有「囚」字，与拘系、囚俘相关。'
    },
    {
      id: 'xing', glyph: 'star', kai: '星', pinyin: 'xīng', volume: '自然',
      meaning: '星辰',
      logic: '上面是几颗星，下面画一棵小草，星声从生。',
      kid: '天上洒下几颗小星星，下面长着一棵小草。',
      adult: '甲骨「星」从晶（众星）从生，生亦声，会意兼形声；或径作数点之星。',
      bone: '',
      gloss: '「星」在卜辞中与天象、祭祀相关。'
    },
    {
      id: 'feng', glyph: 'wind', kai: '风', pinyin: 'fēng', volume: '自然',
      meaning: '风',
      logic: '借凤鸟的形状表示风：神鸟展翅，风就来了。',
      kid: '一只神鸟扇扇翅膀，风就吹起来了。',
      adult: '甲骨无「风」本字，多借「凤」为之；凤鸟展翅生风，后世加「凡」声作「風」。',
      bone: '',
      gloss: '卜辞借「凤」问风之来否。'
    },
    {
      id: 'lei', glyph: 'thunder', kai: '雷', pinyin: 'léi', volume: '自然',
      meaning: '雷声',
      logic: '雨点下面画一块田，用雨中的田形表示隆隆雷声。',
      kid: '下雨啦，雷声轰隆隆滚过田头。',
      adult: '甲骨「雷」多从雨、从田，或以田象雷声，会雨中雷鸣之意。',
      bone: '',
      gloss: '「雷」在卜辞中与风雨、年成相关。'
    },
    {
      id: 'quan', glyph: 'spring', kai: '泉', pinyin: 'quán', volume: '自然',
      meaning: '泉水',
      logic: '山崖下有一汪水，水从石缝里涌出来。',
      kid: '石头缝里咕嘟咕嘟冒出一股清泉。',
      adult: '甲骨「泉」象泉水自石穴流出，本义为水源。',
      bone: '',
      gloss: '卜辞「泉」多用作水名、地名。'
    },
    {
      id: 'gu', glyph: 'valley', kai: '谷', pinyin: 'gǔ', volume: '自然',
      meaning: '山谷',
      logic: '两山夹着一道水，水从谷口流出来。',
      kid: '两座山中间有一条小河，那就是山谷。',
      adult: '甲骨「谷」象两山之间流水，上象谷口，下象水出。',
      bone: '',
      gloss: '卜辞「谷」多指山谷之地。'
    },
    {
      id: 'qiuqiu', glyph: 'hill', kai: '丘', pinyin: 'qiū', volume: '自然',
      meaning: '土丘',
      logic: '平地上鼓起两座小土丘。',
      kid: '地上鼓起两个小土包，就是小山丘。',
      adult: '甲骨「丘」象平地隆起之土丘，或二峰并立。',
      bone: '',
      gloss: '卜辞「丘」常用作地名。'
    },
    {
      id: 'ma', glyph: 'horse', kai: '马', pinyin: 'mǎ', volume: '动物',
      meaning: '马',
      logic: '画一匹侧立的马：大眼、尖耳、鬃毛、长尾和四条腿。',
      kid: '一匹小马，竖着尖耳朵，甩着长尾巴。',
      adult: '甲骨「马」象马侧视，首有耳、颈有鬃，长尾四足，特征鲜明。',
      bone: '',
      gloss: '卜辞「马」或指马牲，或为方国名。'
    },
    {
      id: 'quangou', glyph: 'dog', kai: '犬', pinyin: 'quǎn', volume: '动物',
      meaning: '狗',
      logic: '画一只侧立的狗：瘦腹、卷尾、竖耳。',
      kid: '一只小狗，肚子瘦瘦的，尾巴往上翘。',
      adult: '甲骨「犬」象狗侧视，腹瘦尾卷；与「豕」腹肥尾垂相对。',
      bone: '',
      gloss: '卜辞常以犬为祭牲。'
    },
    {
      id: 'shizhu', glyph: 'pig', kai: '豕', pinyin: 'shǐ', volume: '动物',
      meaning: '猪',
      logic: '画一只侧立的猪：肚子肥圆，尾巴短垂。',
      kid: '一只胖小猪，肚子圆鼓鼓，尾巴短短的。',
      adult: '甲骨「豕」象猪侧视，腹肥尾短；与「犬」以腹、尾之形相别。',
      bone: '',
      gloss: '卜辞「豕」多记用豕为牲。'
    },
    {
      id: 'er', glyph: 'ear', kai: '耳', pinyin: 'ěr', volume: '人体',
      meaning: '耳朵',
      logic: '画一只耳朵的轮廓，中间一点是耳窍。',
      kid: '一只耳朵，中间有个小洞洞。',
      adult: '甲骨「耳」象人耳之形，中加一点或短画以示耳窍。',
      bone: '疾耳',
      gloss: '卜问耳疾之事。'
    },
    {
      id: 'xin', glyph: 'heart', kai: '心', pinyin: 'xīn', volume: '人体',
      meaning: '心脏',
      logic: '画一颗心的轮廓，中间几道纹是心房。',
      kid: '一颗心，中间有几道弯弯的纹。',
      adult: '甲骨「心」象心脏轮廓，中作数画以示心房心室。',
      bone: '疾心',
      gloss: '卜问心疾之事。'
    },
    {
      id: 'shou', glyph: 'head', kai: '首', pinyin: 'shǒu', volume: '人体',
      meaning: '头',
      logic: '画一个人的头：上有头发，中间一只眼睛。',
      kid: '一个人的脑袋，上面竖着几根头发，中间有只眼睛。',
      adult: '甲骨「首」象人头，上有发，中有目，本义为头。',
      bone: '疾首',
      gloss: '卜问头疾之事。'
    },
    {
      id: 'zhou', glyph: 'boat', kai: '舟', pinyin: 'zhōu', volume: '器物',
      meaning: '船',
      logic: '画一只小船：两边船帮，中间几道横档。',
      kid: '一只小船，中间搭着几根横木。',
      adult: '甲骨「舟」象小舟侧视，两侧为船帮，中横为舱档。',
      bone: '',
      gloss: '卜辞「舟」与渡水、舟运相关。'
    },
    {
      id: 'gong', glyph: 'bow', kai: '弓', pinyin: 'gōng', volume: '器物',
      meaning: '弓箭',
      logic: '画一把弯弓，弦绷得紧紧的。',
      kid: '一把弯弯的弓，弦拉得直直的。',
      adult: '甲骨「弓」象弓身弯曲、弓弦绷紧之形。',
      bone: '',
      gloss: '卜辞「弓」与射猎、兵器相关。'
    },
    {
      id: 'che', glyph: 'cart', kai: '车', pinyin: 'chē', volume: '器物',
      meaning: '车',
      logic: '画一辆车：两个轮子，中间一根车轴，前面伸出车辕。',
      kid: '一辆小车，两个圆轮子中间穿着一根轴。',
      adult: '甲骨「车」多作俯视或侧视，象双轮、车轴、车辕之形。',
      bone: '',
      gloss: '卜辞「车」多记车马、田猎之事。'
    },
    {
      id: 'tiger', glyph: 'tiger', kai: '虎', pinyin: 'hǔ', volume: '动物',
      meaning: '老虎',
      logic: '画一只老虎：张开大嘴，身上有条纹，长尾巴向上卷。',
      kid: '一只大老虎张着嘴巴，身上一条条花纹。',
      adult: '甲骨「虎」象虎侧视，巨口利齿、身有斑纹、长尾上卷，特征分明。',
      bone: '获虎',
      gloss: '记田猎捕获老虎。'
    },
    {
      id: 'deer', glyph: 'deer', kai: '鹿', pinyin: 'lù', volume: '动物',
      meaning: '鹿',
      logic: '画一只鹿：头顶枝状的角，大眼睛，细腿短尾。',
      kid: '小鹿顶着树枝一样的角，眼睛大大的。',
      adult: '甲骨「鹿」象鹿侧视，枝角、大目、细足，角形尤为突出。',
      bone: '逐鹿',
      gloss: '田猎时追逐鹿群。'
    },
    {
      id: 'rabbit', glyph: 'rabbit', kai: '兔', pinyin: 'tù', volume: '动物',
      meaning: '兔子',
      logic: '画一只兔子：竖起长耳，短尾巴，后腿比前腿长。',
      kid: '小兔子竖起两只长耳朵，尾巴短短的。',
      adult: '甲骨「兔」象兔侧视，长耳短尾，后足长而前足短。',
      bone: '',
      gloss: '「兔」在卜辞中多为田猎所获之兽。'
    },
    {
      id: 'turtle', glyph: 'turtle', kai: '龟', pinyin: 'guī', volume: '动物',
      meaning: '乌龟',
      logic: '画一只乌龟：圆圆隆起的背甲，四条短腿，小尾巴。',
      kid: '小乌龟背着圆圆的壳，四条腿慢慢爬。',
      adult: '甲骨「龟」象龟之形，圆背四足，或作俯视，背上甲纹或省。',
      bone: '',
      gloss: '龟腹甲是占卜的主要材料，「龟」字本身即象其形。'
    },
    {
      id: 'shell', glyph: 'shell', kai: '贝', pinyin: 'bèi', volume: '动物',
      meaning: '海贝',
      logic: '画一枚海贝：两扇壳合起，壳面上有一道道齿纹。',
      kid: '一枚小贝壳，壳上有一道道齿纹。',
      adult: '甲骨「贝」象海贝之形，壳有齿纹；商周以贝为宝货，故「财」「货」皆从贝。',
      bone: '',
      gloss: '贝是商代宝货，后世「财」「货」等字皆从贝。'
    },
    {
      id: 'horn', glyph: 'horn', kai: '角', pinyin: 'jiǎo', volume: '动物',
      meaning: '兽角',
      logic: '画一只兽角：根部粗，尖端弯，角上有纹。',
      kid: '一只弯弯的兽角，粗的一头连着脑袋。',
      adult: '甲骨「角」象兽角之形，上有纹理，本义为牛角。',
      bone: '',
      gloss: '「角」本义为兽角，后引申为角落、量器。'
    },
    {
      id: 'woman', glyph: 'woman', kai: '女', pinyin: 'nǚ', volume: '人体',
      meaning: '女子',
      logic: '画一个跪坐的女子：双手交叠，放在身前。',
      kid: '一个女孩子跪坐着，双手放在身前。',
      adult: '甲骨「女」象女子跪坐、双手交叠之形；「母」于胸前加两点以别。',
      bone: '',
      gloss: '「女」部字多与女性、婚育相关。'
    },
    {
      id: 'child', glyph: 'child', kai: '子', pinyin: 'zǐ', volume: '人体',
      meaning: '孩子',
      logic: '画一个婴儿：头大，两臂张开，两腿并拢。',
      kid: '一个小宝宝张开双手，腿还并在一起。',
      adult: '甲骨「子」象婴儿之形，头大而臂张，两足并拢或裹于襁褓。',
      bone: '',
      gloss: '卜辞「子」多指王子、子嗣。'
    },
    {
      id: 'stand', glyph: 'stand', kai: '立', pinyin: 'lì', volume: '人体',
      meaning: '站立',
      logic: '一个人张开手脚站在地面上，脚下一条横线就是地。',
      kid: '一个人张开双手，稳稳站在地上。',
      adult: '甲骨「立」从大（正面人形）加一横为地，会人站立之意。',
      bone: '',
      gloss: '「立」后引申为设立、位次。'
    },
    {
      id: 'gate', glyph: 'gate', kai: '门', pinyin: 'mén', volume: '器物',
      meaning: '门户',
      logic: '画两扇对开的门：左右各一扇，上面是门楣。',
      kid: '两扇大门并排立着，一推就开。',
      adult: '甲骨「门」象双扇门形，左右相对，上端象门楣。',
      bone: '',
      gloss: '「门」部字多与门户、开闭相关。'
    },
    {
      id: 'robe', glyph: 'robe', kai: '衣', pinyin: 'yī', volume: '器物',
      meaning: '上衣',
      logic: '画一件上衣：上面是领口，两边伸出袖子，下面是衣襟。',
      kid: '一件小衣服，上面有领子，两边有袖子。',
      adult: '甲骨「衣」象上衣之形，上有领口，下有衣襟，本义为上衣。',
      bone: '',
      gloss: '卜辞「衣」多借作祭名。'
    },
    {
      id: 'knife', glyph: 'knife', kai: '刀', pinyin: 'dāo', volume: '器物',
      meaning: '刀',
      logic: '画一把刀：刀身弯弯，刀柄短短。',
      kid: '一把小刀，刀刃弯弯的。',
      adult: '甲骨「刀」象刀形，刃部外凸、柄短；「刃」于刃口加点以指其处。',
      bone: '',
      gloss: '「刀」部字多与刀具、切割相关。'
    },
    {
      id: 'daggeraxe', glyph: 'daggeraxe', kai: '戈', pinyin: 'gē', volume: '器物',
      meaning: '戈',
      logic: '画一柄戈：横着的刃，长长的柄，下面还有尖脚。',
      kid: '一柄长长的戈，横着锋利的刃。',
      adult: '甲骨「戈」象戈之全形：横刃、直内、长柲，为商代常见兵器。',
      bone: '',
      gloss: '卜辞「戈」多与征伐、兵器相关。'
    },
    {
      id: 'tripod', glyph: 'tripod', kai: '鼎', pinyin: 'dǐng', volume: '器物',
      meaning: '鼎',
      logic: '画一只鼎：上面两只耳，中间圆腹，下面三条腿。',
      kid: '一只大鼎，有两只耳朵和三条腿。',
      adult: '甲骨「鼎」象鼎之形：双耳、圆腹、三足，或于腹上画出纹饰。',
      bone: '',
      gloss: '青铜鼎是商周礼器，后世「定鼎」即由此而来。'
    },
    {
      id: 'jade', glyph: 'jade', kai: '玉', pinyin: 'yù', volume: '器物',
      meaning: '美玉',
      logic: '画一串玉：一根绳上穿着几块玉片。',
      kid: '一根线串起几片亮亮的玉。',
      adult: '甲骨「玉」象绳串玉片之形；后世加点，以别于「王」。',
      bone: '',
      gloss: '卜辞「玉」多指玉器，与祭祀、贡纳相关。'
    },
    {
      id: 'xi', glyph: 'xi', kai: '夕', pinyin: 'xī', volume: '自然',
      meaning: '傍晚',
      logic: '画一弯细细的月牙，表示太阳落山后的傍晚。',
      kid: '天黑了，天上挂着一弯细细的月牙。',
      adult: '甲骨「夕」与「月」同形，皆作半月之形；卜辞中「夕」指夜晚，与「日」相对。',
      bone: '今夕',
      gloss: '卜辞常见「今夕」，问今夜吉凶、有雨无雨。'
    },
    {
      id: 'jing', glyph: 'jing', kai: '晶', pinyin: 'jīng', volume: '自然',
      meaning: '光亮',
      logic: '三个太阳叠在一起，表示光亮四射。',
      kid: '三个小太阳凑在一起，亮晶晶的。',
      adult: '甲骨「晶」以三个日（或星形）相叠，会光亮之意，本义为明亮。',
      bone: '',
      gloss: '「晶」本义为光亮，后多用于「水晶」「结晶」。'
    },
    {
      id: 'qi', glyph: 'qi', kai: '气', pinyin: 'qì', volume: '自然',
      meaning: '云气',
      logic: '画三道横线，像天上飘浮的云气。',
      kid: '天上飘着三缕云气，轻轻往上走。',
      adult: '甲骨「气」作三横，中画稍短，象云气层叠；本义为云气。',
      bone: '',
      gloss: '「气」本义为云气，后引申为气息、天气。'
    },
    {
      id: 'xiang', glyph: 'xiang', kai: '象', pinyin: 'xiàng', volume: '动物',
      meaning: '大象',
      logic: '画一头大象：长鼻子、大耳朵、四条粗腿。',
      kid: '一头大象，长鼻子卷起来，耳朵像扇子。',
      adult: '甲骨「象」象大象侧视，长鼻上卷、巨耳、四足，特征分明。',
      bone: '',
      gloss: '「象」本义为大象，后借以表示形象、想象。'
    },
    {
      id: 'yan', glyph: 'yan', kai: '燕', pinyin: 'yàn', volume: '动物',
      meaning: '燕子',
      logic: '画一只燕子：尖嘴、张开的翅膀、分叉的尾巴。',
      kid: '一只小燕子，张开翅膀，尾巴像剪刀。',
      adult: '甲骨「燕」象燕之形，尖喙、双翼、叉尾，本义为燕子。',
      bone: '',
      gloss: '「燕」本义为燕子，后世又借为宴饮之「宴」。'
    },
    {
      id: 'chong', glyph: 'chong', kai: '虫', pinyin: 'chóng', volume: '动物',
      meaning: '蛇',
      logic: '画一条蛇：三角形的头，弯弯的身子。',
      kid: '一条小蛇，脑袋尖尖，身子弯弯。',
      adult: '甲骨「虫」象蛇之形，头作三角、身曲尾细，本义即蛇。',
      bone: '',
      gloss: '「虫」本义为蛇，后世才泛指虫类。'
    },
    {
      id: 'chi', glyph: 'chi', kai: '齿', pinyin: 'chǐ', volume: '人体',
      meaning: '牙齿',
      logic: '画一张嘴，里面露出几颗牙齿。',
      kid: '张开嘴巴，里面一排小牙齿。',
      adult: '甲骨「齿」于口中画出牙齿之形，本义为牙齿。',
      bone: '疾齿',
      gloss: '卜问牙疾之事。'
    },
    {
      id: 'mei', glyph: 'mei', kai: '眉', pinyin: 'méi', volume: '人体',
      meaning: '眉毛',
      logic: '画一只眼睛，眼睛上面加几道毛。',
      kid: '眼睛上面长着几根弯弯的眉毛。',
      adult: '甲骨「眉」于目上加毛，会眉毛之意。',
      bone: '',
      gloss: '「眉」本义为眉毛，后引申为眉目、眉寿。'
    },
    {
      id: 'zi', glyph: 'zi', kai: '自', pinyin: 'zì', volume: '人体',
      meaning: '鼻子',
      logic: '画一个鼻子：中间两道鼻梁，下面两个鼻孔。',
      kid: '一个鼻子，下面有两个小鼻孔。',
      adult: '甲骨「自」象鼻之形，本义为鼻；后借为「自己」之自。',
      bone: '',
      gloss: '「自」本为鼻的象形，卜辞多借为「从、自」之自。'
    },
    {
      id: 'zun', glyph: 'zun', kai: '尊', pinyin: 'zūn', volume: '器物',
      meaning: '酒尊',
      logic: '画一只酒尊：口沿外撇，圆腹，下有圈足。',
      kid: '一只高高的酒杯，肚子里能装酒。',
      adult: '甲骨「尊」象双手捧酒器之形，本义为酒器。',
      bone: '',
      gloss: '「尊」本义为酒器，后引申为尊敬、尊长。'
    },
    {
      id: 'jue', glyph: 'jue', kai: '爵', pinyin: 'jué', volume: '器物',
      meaning: '酒爵',
      logic: '画一只爵：一边是倒酒的流，一边是尖尾，下面三条腿。',
      kid: '一只三只脚的小酒杯，前面有个倒酒的口。',
      adult: '甲骨「爵」象爵形：有流、有尾、有鋬，下承三足。',
      bone: '',
      gloss: '「爵」本为酒器，后世成为爵位之称。'
    },
    {
      id: 'hu', glyph: 'hu', kai: '壶', pinyin: 'hú', volume: '器物',
      meaning: '壶',
      logic: '画一只壶：上面有盖，肚子圆圆，两边有耳。',
      kid: '一只圆肚子的小壶，两边有提手。',
      adult: '甲骨「壶」象壶形：有盖、圆腹、圈足，或加双耳。',
      bone: '',
      gloss: '「壶」本为盛酒浆之器，形制沿用至今。'
    },
    {
      id: 'wang', glyph: 'wang', kai: '网', pinyin: 'wǎng', volume: '器物',
      meaning: '渔网',
      logic: '画一张网：两根木杆撑起交叉的网线。',
      kid: '一张渔网，格子里能兜住鱼。',
      adult: '甲骨「网」象张网之形，网线交叉，两端有柄。',
      bone: '',
      gloss: '「网」本象渔网，后世加糸作「網」，今又简化为「网」。'
    },
    {
      id: 'ce', glyph: 'ce', kai: '册', pinyin: 'cè', volume: '器物',
      meaning: '书册',
      logic: '画几片竹简，用绳子串在一起。',
      kid: '几片竹片用绳子串起来，就是一本书。',
      adult: '甲骨「册」象竹简编连之形，本义为书册。',
      bone: '',
      gloss: '「册」象简册编连，是书册之「册」的本字。'
    },
    {
      id: 'broom', glyph: 'broom', kai: '帚', pinyin: 'zhǒu', volume: '器物',
      meaning: '扫帚',
      logic: '画一把扫帚：上面是柄，下面一丛草。',
      kid: '一把小扫帚，能扫地上的土。',
      adult: '甲骨「帚」象手执扫帚之形，本义为扫帚。',
      bone: '帚好',
      gloss: '卜辞多以「帚」为「妇」，「帚好」即妇好。'
    },
    {
      id: 'guang', glyph: 'guang', kai: '光', pinyin: 'guāng', volume: '自然',
      meaning: '光亮',
      logic: '画一个人顶着火，火光向上照亮。',
      kid: '一个人头顶着一团火，把四周照亮。',
      adult: '甲骨「光」从火在人上，会光明之意，本义为光亮。',
      bone: '',
      gloss: '「光」本义为光亮，后引申为光彩、时光。'
    },
    {
      id: 'hong', glyph: 'hong', kai: '虹', pinyin: 'hóng', volume: '自然',
      meaning: '彩虹',
      logic: '画一条两头的龙，弯弯地横在天上。',
      kid: '雨后天边弯弯的彩桥，古人说那是一条双头龙。',
      adult: '甲骨「虹」象双首之虫（龙）横跨天际，本义为虹。',
      bone: '出虹',
      gloss: '卜辞见「虹自北饮于河」，商人把虹看作饮水的龙。'
    },
    {
      id: 'snow', glyph: 'snow', kai: '雪', pinyin: 'xuě', volume: '自然',
      meaning: '雪',
      logic: '上面是雨，下面是一把扫帚，扫去雨变成的雪。',
      kid: '天上落下的雨，冻成了白白的雪。',
      adult: '甲骨「雪」上雨下彗（扫帚），以扫帚会扫落之意，本义为雪。',
      bone: '',
      gloss: '「雪」上雨下彗，本义为雪，后引申为洗雪。'
    },
    {
      id: 'long', glyph: 'long', kai: '龙', pinyin: 'lóng', volume: '动物',
      meaning: '龙',
      logic: '画一条龙：大嘴、长身、头上有角。',
      kid: '一条大龙，张着嘴，头上有角，身子弯弯。',
      adult: '甲骨「龙」象龙形，巨口、有角、长身，为神异之物。',
      bone: '',
      gloss: '「龙」本象龙形，后世成为四灵之一。'
    },
    {
      id: 'zhui', glyph: 'zhui', kai: '隹', pinyin: 'zhuī', volume: '动物',
      meaning: '短尾鸟',
      logic: '画一只鸟：短尾巴，尖尖的嘴。',
      kid: '一只小鸟，短尾巴，尖嘴巴。',
      adult: '甲骨「隹」象短尾鸟之形，与「鸟」同为鸟类统称。',
      bone: '',
      gloss: '卜辞多借「隹」为「唯」，作发语词。'
    },
    {
      id: 'yu2', glyph: 'yu2', kai: '羽', pinyin: 'yǔ', volume: '动物',
      meaning: '羽毛',
      logic: '画两根羽毛，并排长着。',
      kid: '两根轻飘飘的羽毛。',
      adult: '甲骨「羽」象鸟羽之形，本义为羽毛。',
      bone: '',
      gloss: '「羽」本义为鸟羽，后引申为羽翼、五音之羽。'
    },
    {
      id: 'blood', glyph: 'blood', kai: '血', pinyin: 'xuè', volume: '人体',
      meaning: '血',
      logic: '画一只器皿，里面点了一点，表示血。',
      kid: '碗里盛着一点血，古人用它祭祀。',
      adult: '甲骨「血」从皿加一点，会血在器中之意。',
      bone: '',
      gloss: '「血」本义为血，古人以血祭神。'
    },
    {
      id: 'lao', glyph: 'lao', kai: '老', pinyin: 'lǎo', volume: '人体',
      meaning: '老人',
      logic: '画一个驼背的人，头发长长的。',
      kid: '一位弯着腰、头发长长的老爷爷。',
      adult: '甲骨「老」象老人长发、佝偻之形，本义为年老。',
      bone: '',
      gloss: '「老」本义为年老，后引申为敬老、老练。'
    },
    {
      id: 'shen', glyph: 'shen', kai: '身', pinyin: 'shēn', volume: '人体',
      meaning: '身体',
      logic: '画一个人的躯干，肚子微微鼓起。',
      kid: '一个人的身子，肚子圆圆的。',
      adult: '甲骨「身」象人腹之形，本义为身躯。',
      bone: '',
      gloss: '「身」本义为身躯，后引申为自身、身份。'
    },
    {
      id: 'arrow', glyph: 'arrow', kai: '矢', pinyin: 'shǐ', volume: '器物',
      meaning: '箭',
      logic: '画一支箭：上面是箭头，下面是箭羽。',
      kid: '一支箭，尖头朝上，尾巴上有羽毛。',
      adult: '甲骨「矢」象箭形，有镞、有杆、有羽，本义为箭。',
      bone: '',
      gloss: '「矢」本义为箭，后世「箭」行而「矢」多用于文言。'
    },
    {
      id: 'jin', glyph: 'jin', kai: '斤', pinyin: 'jīn', volume: '器物',
      meaning: '斧头',
      logic: '画一把斧子，刃朝左，柄在右。',
      kid: '一把小斧头，能砍木头。',
      adult: '甲骨「斤」象斧形，横刃装柄，本义为斧。',
      bone: '',
      gloss: '「斤」本义为斧，后世借为重量单位。'
    },
    {
      id: 'you', glyph: 'you', kai: '酉', pinyin: 'yǒu', volume: '器物',
      meaning: '酒坛',
      logic: '画一只酒坛：尖底、有盖，里面装着酒。',
      kid: '一只尖底的小酒坛，坛口有盖。',
      adult: '甲骨「酉」象酒器之形，本义为盛酒之器，后借为地支之酉。',
      bone: '',
      gloss: '「酉」本为酒器，酒、尊等字皆从酉得义。'
    },
    {
      id: 'min', glyph: 'min', kai: '皿', pinyin: 'mǐn', volume: '器物',
      meaning: '器皿',
      logic: '画一只浅盆，两边有耳。',
      kid: '一只小盆子，两边有把手。',
      adult: '甲骨「皿」象饮食之器，本义为器皿。',
      bone: '',
      gloss: '「皿」是部首字，盘、盂、盆等字皆从皿。'
    },
    {
      id: 'dou', glyph: 'dou', kai: '豆', pinyin: 'dòu', volume: '器物',
      meaning: '高脚盘',
      logic: '画一只高脚盘：上面是盘，下面是细柄和底座。',
      kid: '一只高脚的小盘子，古人用来盛食物。',
      adult: '甲骨「豆」象高足食器之形，本义为盛食之器。',
      bone: '',
      gloss: '「豆」本为食器，后世才借指豆类。'
    },
    {
      id: 'gu2', glyph: 'gu2', kai: '鼓', pinyin: 'gǔ', volume: '器物',
      meaning: '鼓',
      logic: '画一面鼓：鼓身立在架上，旁边有人持槌。',
      kid: '一面大鼓，咚咚咚地响。',
      adult: '甲骨「鼓」象鼓形，或加手持槌，会击鼓之意。',
      bone: '',
      gloss: '「鼓」本义为击鼓，后指鼓这种乐器。'
    },
    {
      id: 'he2', glyph: 'he2', kai: '禾', pinyin: 'hé', volume: '自然',
      meaning: '谷子',
      logic: '画一株成熟的谷子：上面谷穗弯弯下垂，下面是根。',
      kid: '一株谷子，穗子沉甸甸地弯下了腰。',
      adult: '甲骨「禾」象成熟的谷子，上象穗与叶，下象根。',
      bone: '受禾',
      gloss: '卜辞问「受禾」，就是问今年的谷子收成好不好。'
    },
    {
      id: 'mai', glyph: 'mai', kai: '麦', pinyin: 'mài', volume: '自然',
      meaning: '麦子',
      logic: '画一株麦子：中间一根麦秆，两边垂着麦穗。',
      kid: '一株麦子，穗子一颗颗往下垂。',
      adult: '甲骨「麦」象麦株之形，本义为大麦。',
      bone: '',
      gloss: '「麦」和「禾」都画庄稼，区别在穗子朝下垂还是朝上举。'
    },
    {
      id: 'sang', glyph: 'sang', kai: '桑', pinyin: 'sāng', volume: '自然',
      meaning: '桑树',
      logic: '画一棵桑树：枝上长满叶子，采下来喂蚕。',
      kid: '一棵桑树，叶子多得数不清。',
      adult: '甲骨「桑」象桑树之形，上象枝叶，下象根。',
      bone: '',
      gloss: '桑叶养蚕，桑和丝是商人生活里常见的东西。'
    },
    {
      id: 'shu3', glyph: 'shu3', kai: '鼠', pinyin: 'shǔ', volume: '动物',
      meaning: '老鼠',
      logic: '画一只老鼠：尖嘴、竖耳、长尾巴，嘴边还有啃下的碎屑。',
      kid: '一只小老鼠，尖嘴长尾巴，偷偷啃东西。',
      adult: '甲骨「鼠」象鼠形，突出尖喙、竖耳与长尾。',
      bone: '',
      gloss: '甲骨「鼠」重画尖嘴和长尾，一眼就能认出来。'
    },
    {
      id: 'ta', glyph: 'ta', kai: '它', pinyin: 'tā', volume: '动物',
      meaning: '蛇',
      logic: '画一条盘起来的蛇：头在上面，身子一圈圈绕下去。',
      kid: '一条盘着的蛇，古人见了就喊「它」。',
      adult: '「它」本为蛇的象形字，后借作第三人称代词。',
      bone: '',
      gloss: '「它」原来是蛇，后来才借去当「他、它」用。'
    },
    {
      id: 'ji', glyph: 'ji', kai: '鸡', pinyin: 'jī', volume: '动物',
      meaning: '鸡',
      logic: '画一只公鸡：头顶高冠，尖嘴长尾，脚上还系着绳。',
      kid: '一只大公鸡，头顶红冠，尾巴翘得高高的。',
      adult: '甲骨「鸡」象鸡形，或加声符，本义为鸡。',
      bone: '',
      gloss: '「鸡」画的是高冠长尾的鸟，商人已经把它养在家里。'
    },
    {
      id: 'you3', glyph: 'you3', kai: '又', pinyin: 'yòu', volume: '人体',
      meaning: '右手',
      logic: '画一只右手：三根手指朝上，手腕在下面。',
      kid: '一只右手，伸出三根手指。',
      adult: '甲骨「又」象右手之形，本义为右手，后借为「再、又」。',
      bone: '',
      gloss: '「又」本是右手，后来借去表示「再一次」。'
    },
    {
      id: 'zhi3', glyph: 'zhi3', kai: '止', pinyin: 'zhǐ', volume: '人体',
      meaning: '脚',
      logic: '画一只脚：三个脚趾朝上，脚掌在下面。',
      kid: '一只脚丫，脚趾头清清楚楚。',
      adult: '甲骨「止」象人足之形，本义为脚，后引申为「停止」。',
      bone: '',
      gloss: '「止」本是脚，走到头停下，才有了「停止」的意思。'
    },
    {
      id: 'mu3', glyph: 'mu3', kai: '母', pinyin: 'mǔ', volume: '人体',
      meaning: '母亲',
      logic: '画一位母亲：跪坐的人形，胸前加两点表示哺育。',
      kid: '一位妈妈跪坐着，胸前两点是喂孩子的记号。',
      adult: '甲骨「母」在「女」字胸前加两点，表示哺乳，本义为母亲。',
      bone: '母辛',
      gloss: '卜辞称先母为「母辛」「母癸」，那两点就是哺育的记号。'
    },
    {
      id: 'fou', glyph: 'fou', kai: '缶', pinyin: 'fǒu', volume: '器物',
      meaning: '陶罐',
      logic: '画一只陶罐：圆肚子、小口，上面还盖着盖。',
      kid: '一只大肚子陶罐，能装水也能装酒。',
      adult: '甲骨「缶」象陶器之形，本义为瓦器。',
      bone: '',
      gloss: '「缶」是陶土烧的罐子，古人用它盛水盛酒。'
    },
    {
      id: 'li4', glyph: 'li4', kai: '鬲', pinyin: 'lì', volume: '器物',
      meaning: '三足锅',
      logic: '画一只三条腿的锅：肚子鼓鼓，腿是空心的。',
      kid: '一只三条腿的锅，腿中间能塞柴火烧饭。',
      adult: '甲骨「鬲」象空足炊器之形，三足中空，便于受火。',
      bone: '',
      gloss: '「鬲」是煮饭的锅，三条腿之间正好塞柴火。'
    },
    {
      id: 'yu4', glyph: 'yu4', kai: '盂', pinyin: 'yú', volume: '器物',
      meaning: '大盆',
      logic: '画一只敞口的大盆：两边有把手，里面能盛水。',
      kid: '一只大盆，能盛满满一盆水。',
      adult: '甲骨「盂」象盛水之器，本义为盛液体的器皿。',
      bone: '',
      gloss: '「盂」是大口的盆，后来「痰盂」的「盂」也是它。'
    },
    {
      id: 'jia', glyph: 'jia', kai: '家', pinyin: 'jiā', volume: '器物',
      meaning: '家',
      logic: '画一座屋子，屋里关着一头猪——有屋有畜，就是家。',
      kid: '房子里养着一头猪，这就是古人的「家」。',
      adult: '甲骨「家」从宀从豕，屋下养猪，会「人家、家族」之意。',
      bone: '',
      gloss: '屋下有猪才算安家，这是商人对「家」的理解。'
    },
    {
      id: 'gong2', glyph: 'gong2', kai: '宫', pinyin: 'gōng', volume: '器物',
      meaning: '房屋',
      logic: '画一座大房子：两间屋子连在一起，屋顶上还有烟囱。',
      kid: '一座大房子，一间连着一间。',
      adult: '甲骨「宫」象房屋相连之形，本义为房屋、居室。',
      bone: '',
      gloss: '「宫」原本只是房屋，后来才专指帝王的宫殿。'
    },
    {
      id: 'hu4', glyph: 'hu4', kai: '户', pinyin: 'hù', volume: '器物',
      meaning: '单扇门',
      logic: '画一扇单开的门：一块门板，一根门轴。',
      kid: '一扇门板，推开就是家。',
      adult: '甲骨「户」象单扇门之形，本义为门。',
      bone: '',
      gloss: '「户」是单扇的门，一户人家就从这扇门算起。'
    },
    {
      id: 'chun', glyph: 'chun', kai: '春', pinyin: 'chūn', volume: '自然',
      meaning: '春天',
      logic: '画一株嫩芽顶着太阳：太阳一暖，草木就发芽。',
      kid: '春天来了，太阳底下抽出新芽。',
      adult: '甲骨「春」从日、从艸，象春日草木萌生。',
      bone: '',
      gloss: '「春」由日与草木组成，本义就是春天。'
    },
    {
      id: 'qiu2', glyph: 'qiu2', kai: '秋', pinyin: 'qiū', volume: '自然',
      meaning: '秋天',
      logic: '画一只蟋蟀：秋天虫鸣，古人就用它代表秋。',
      kid: '秋天到了，蟋蟀在草丛里叫。',
      adult: '甲骨「秋」象蟋蟀之形，或加「火」，本义为秋天。',
      bone: '',
      gloss: '有的「秋」写成禾加火：庄稼熟了，可以烧田了。'
    },
    {
      id: 'dong', glyph: 'dong', kai: '冬', pinyin: 'dōng', volume: '自然',
      meaning: '冬天',
      logic: '画一根绳子两头打结：一年的线到头了，就是冬。',
      kid: '绳子两头打了结，表示一年过完了。',
      adult: '甲骨「冬」象绳两端打结，会「终」之意，后指冬天。',
      bone: '',
      gloss: '「冬」本是「终」：一年的日子走到头，结个扣。'
    },
    {
      id: 'hu2', glyph: 'hu2', kai: '狐', pinyin: 'hú', volume: '动物',
      meaning: '狐狸',
      logic: '画一只狐狸：尖嘴长身，拖着一条大尾巴。',
      kid: '一只狐狸，尖嘴大尾巴，脚步轻轻的。',
      adult: '甲骨「狐」从犬，象狐形，本义为狐狸。',
      bone: '',
      gloss: '「狐」是犬旁加一个兽形，古人把它归在犬类。'
    },
    {
      id: 'feng2', glyph: 'feng2', kai: '凤', pinyin: 'fèng', volume: '动物',
      meaning: '凤凰',
      logic: '画一只神鸟：高冠、长尾、翅膀张开。',
      kid: '一只神气的大鸟，就是传说中的凤凰。',
      adult: '甲骨「凤」象凤鸟之形，突出高冠与华丽的长尾。',
      bone: '',
      gloss: '「风」的甲骨文就借「凤」来写，神鸟一来，风就起了。'
    },
    {
      id: 'bao', glyph: 'bao', kai: '豹', pinyin: 'bào', volume: '动物',
      meaning: '豹子',
      logic: '画一只豹子：身上点点斑纹，尾巴翘起来。',
      kid: '一只豹子，身上满是花花点子。',
      adult: '甲骨「豹」从豸，象豹形，突出身上的斑纹。',
      bone: '',
      gloss: '「豹」字里的点点，就是它身上花纹的写照。'
    },
    {
      id: 'ye', glyph: 'ye', kai: '页', pinyin: 'yè', volume: '人体',
      meaning: '头',
      logic: '画一个人的脑袋：大大的人头，下面是脖子。',
      kid: '一个脑袋，上面一只大眼睛。',
      adult: '甲骨「页」象人头之形，本义为头。',
      bone: '',
      gloss: '「页」本是脑袋，后来才借去表示书页。'
    },
    {
      id: 'er2', glyph: 'er2', kai: '儿', pinyin: 'ér', volume: '人体',
      meaning: '小孩',
      logic: '画一个小孩：头顶囟门没合，两条腿并着。',
      kid: '一个小娃娃，脑袋大、腿短短。',
      adult: '甲骨「儿」象幼儿之形，头顶开口，本义为小孩。',
      bone: '',
      gloss: '「儿」画的是头顶囟门未合的小孩。'
    },
    {
      id: 'xiong', glyph: 'xiong', kai: '兄', pinyin: 'xiōng', volume: '人体',
      meaning: '哥哥',
      logic: '画一个人张着大嘴：开口说话、发号令的，是兄长。',
      kid: '一个人张大嘴巴，在跟弟弟妹妹说话。',
      adult: '甲骨「兄」从人从口，象人张口说话，本义为兄长。',
      bone: '',
      gloss: '「兄」是张口发话的人：家里先开口的，就是哥哥。'
    },
    {
      id: 'wu', glyph: 'wu', kai: '午', pinyin: 'wǔ', volume: '器物',
      meaning: '木杵',
      logic: '画一根舂米的木杵：中间一横，两头有柄。',
      kid: '一根舂米的木杵，咚咚地捣米。',
      adult: '甲骨「午」象杵形，本义为舂米的木杵。',
      bone: '',
      gloss: '「午」本是木杵，后来才借去表示地支的午。'
    },
    {
      id: 'shi2', glyph: 'shi2', kai: '示', pinyin: 'shì', volume: '器物',
      meaning: '祭台',
      logic: '画一座祭台：一块横石架在石座上。',
      kid: '一座小石台，古人把祭品放在上面。',
      adult: '甲骨「示」象祭台之形，本义为神主、祭台。',
      bone: '',
      gloss: '「示」是祭台，带示旁的字，多半和祭祀有关。'
    },
    {
      id: 'qie', glyph: 'qie', kai: '且', pinyin: 'qiě', volume: '器物',
      meaning: '神主',
      logic: '画一座石台：方方的台身，上面一横。',
      kid: '一块方方的石台，古人用来放祭品。',
      adult: '甲骨「且」象礼器或祭台之形，或说为祖先神主。',
      bone: '',
      gloss: '「且」像神主牌位，后来才借去表示「而且」。'
    },
    {
      id: 'si', glyph: 'si', kai: '丝', pinyin: 'sī', volume: '器物',
      meaning: '蚕丝',
      logic: '画两束蚕丝：两缕线并排绞在一起。',
      kid: '两缕细细的丝线，绞成了一束。',
      adult: '甲骨「丝」象两束蚕丝之形，本义为蚕丝。',
      bone: '',
      gloss: '两缕丝并在一起就是「丝」，合写就是繁体的「絲」。'
    },
    {
      id: 'peng', glyph: 'peng', kai: '朋', pinyin: 'péng', volume: '器物',
      meaning: '贝串',
      logic: '画两串贝壳：一串几个，并排挂着。',
      kid: '两串贝壳挂在一起，就是「朋」。',
      adult: '甲骨「朋」象两串贝相连之形，本义为贝串，后指朋友。',
      bone: '',
      gloss: '商代用贝作钱，两串贝为一朋，朋友就是「同串」的人。'
    },
    {
      id: 'xin2', glyph: 'xin2', kai: '辛', pinyin: 'xīn', volume: '器物',
      meaning: '凿子',
      logic: '画一把凿子：上面是柄，下面是尖刃。',
      kid: '一把凿子，能凿开木头和石头。',
      adult: '甲骨「辛」象凿具之形，本义为凿子，引申为辛苦。',
      bone: '',
      gloss: '「辛」本是凿子，凿东西费力，才有了「辛苦」。'
    },
    {
      id: 'he', glyph: 'he', kai: '河', pinyin: 'hé', volume: '自然',
      meaning: '河流',
      logic: '画一道水，旁边再加一个「可」，专指黄河那样的大河。',
      kid: '一条大水，哗哗地向东流，这就是「河」。',
      adult: '甲骨「河」从水，可声，卜辞中多指河神，常见「燎于河」之辞。',
      bone: '燎于河',
      gloss: '在河边燃柴燎祭。'
    },
    {
      id: 'ye3', glyph: 'ye3', kai: '野', pinyin: 'yě', volume: '自然',
      meaning: '郊野',
      logic: '一片林子，下面垫着土，就是城外的野地。',
      kid: '树林连着土地，城外空阔的地方就是「野」。',
      adult: '甲骨「野」作「埜」，从林从土，会郊野之意。',
      bone: '',
      gloss: '「野」是林与土：城邑之外，草木土地相连。'
    },
    {
      id: 'yang2', glyph: 'yang2', kai: '阳', pinyin: 'yáng', volume: '自然',
      meaning: '向阳',
      logic: '左边是山坡，右边是太阳，太阳照到的地方就是阳。',
      kid: '太阳照在山坡上，暖暖的，就是「阳」。',
      adult: '甲骨「阳」从阜从日，会日出向阳之意。',
      bone: '',
      gloss: '山南水北为阳，太阳照得到的那一面就叫「阳」。'
    },
    {
      id: 'shu2', glyph: 'shu2', kai: '蜀', pinyin: 'shǔ', volume: '动物',
      meaning: '野蚕',
      logic: '上面一只大眼睛，下面一条蜷曲的虫身，就是野蚕「蜀」。',
      kid: '一条胖胖的虫子，头上顶着一只大眼睛。',
      adult: '甲骨「蜀」上为目、下为虫身，象野蚕之形；卜辞中亦用为方国名。',
      bone: '征蜀',
      gloss: '征伐蜀方。'
    },
    {
      id: 'mi2', glyph: 'mi2', kai: '麋', pinyin: 'mí', volume: '动物',
      meaning: '麋鹿',
      logic: '画一只鹿，头上加一只大眼睛，就是角大眼大的麋鹿。',
      kid: '一只大角鹿，眼睛圆圆的，叫麋鹿。',
      adult: '甲骨「麋」从鹿，上加目形，以鹿角与目为特征。',
      bone: '获麋',
      gloss: '田猎获得麋鹿。'
    },
    {
      id: 'zhi4', glyph: 'zhi4', kai: '雉', pinyin: 'zhì', volume: '动物',
      meaning: '野鸡',
      logic: '一只短尾鸟，旁边插一支箭，古人用箭射雉。',
      kid: '一只花野鸡，扑棱棱飞起来。',
      adult: '甲骨「雉」从隹（短尾鸟）从矢，矢亦表声。',
      bone: '',
      gloss: '「雉」是隹加矢：野鸡飞得快，要用箭去射。'
    },
    {
      id: 'fu', glyph: 'fu', kai: '父', pinyin: 'fù', volume: '人体',
      meaning: '父亲',
      logic: '一只手举着一把石斧，家里拿斧头做主的人就是父。',
      kid: '爸爸举起斧头干活，这就是「父」。',
      adult: '甲骨「父」从又（手）持斧，会手持斧具之意，后指父亲。',
      bone: '父乙',
      gloss: '祭祀名乙的先父。'
    },
    {
      id: 'li', glyph: 'li', kai: '力', pinyin: 'lì', volume: '人体',
      meaning: '力气',
      logic: '画一把翻土的耒耜，用它耕地最费力气。',
      kid: '一把翻土的工具，用它干活要出大力气。',
      adult: '甲骨「力」象耒耜之形，本义为农具，引申为力气。',
      bone: '',
      gloss: '「力」本是农具，耕地要使力，才有了力气的意思。'
    },
    {
      id: 'nan', glyph: 'nan', kai: '男', pinyin: 'nán', volume: '人体',
      meaning: '男子',
      logic: '上面是田，下面是力，在田里出力气的人就是男。',
      kid: '在田里用力干活的人，就是「男」。',
      adult: '甲骨「男」从田从力，会田中用力耕作之意。',
      bone: '',
      gloss: '田加力就是男：古时男子在田里出力。'
    },
    {
      id: 'jing2', glyph: 'jing2', kai: '井', pinyin: 'jǐng', volume: '器物',
      meaning: '水井',
      logic: '四根木条交叉成井栏，中间就是井口。',
      kid: '木头交叉围起来，下面是一口井。',
      adult: '甲骨「井」象井栏交木之形，本义为水井。',
      bone: '',
      gloss: '「井」画的是井口的木栏，后来才引申为井田。'
    },
    {
      id: 'jin2', glyph: 'jin2', kai: '巾', pinyin: 'jīn', volume: '器物',
      meaning: '布巾',
      logic: '一块布搭在架子上，两边垂下来，就是巾。',
      kid: '一块布垂下来，可以擦手擦脸。',
      adult: '甲骨「巾」象布巾下垂之形，本义为佩巾。',
      bone: '',
      gloss: '「巾」是垂下来的布，带巾旁的字多与布帛有关。'
    },
    {
      id: 'zhong', glyph: 'zhong', kai: '中', pinyin: 'zhōng', volume: '器物',
      meaning: '旗杆',
      logic: '一根旗杆，上下都挂着飘带，立在正中。',
      kid: '一根高高的旗杆，飘带在风里摆。',
      adult: '甲骨「中」象旗杆上下有旒之形，本义为旗，引申为中央。',
      bone: '',
      gloss: '「中」本是立在中间的旗，后来才有中间的意思。'
    },
    {
      id: 'gao', glyph: 'gao', kai: '高', pinyin: 'gāo', volume: '器物',
      meaning: '高台',
      logic: '下面高高的台基，上面一座尖顶的屋子，就是高。',
      kid: '一座建在高台上的房子，高高在上。',
      adult: '甲骨「高」象高台建筑之形，上为屋顶，下为台基。',
      bone: '',
      gloss: '「高」画的是建在高台上的屋子，所以有高义。'
    },
    {
      id: 'jing3', glyph: 'jing3', kai: '京', pinyin: 'jīng', volume: '器物',
      meaning: '高丘',
      logic: '一座高高的土丘，上面还盖着房子，就是京。',
      kid: '高高的土堆上盖着房子，就是「京」。',
      adult: '甲骨「京」象高丘之上筑屋之形，本义为高丘、大邑。',
      bone: '',
      gloss: '「京」是建在高丘上的大屋，后来才指京城。'
    },
    {
      id: 'xing2', glyph: 'xing2', kai: '行', pinyin: 'xíng', volume: '器物',
      meaning: '道路',
      logic: '画一个十字路口，四条路通向四方。',
      kid: '四条路交叉在一起，就是路口。',
      adult: '甲骨「行」象四通之道路，本义为道路，引申为行走。',
      bone: '',
      gloss: '「行」本是十字路口，人在路上走，才有了行走。'
    },
    {
      id: 'dong2', glyph: 'dong2', kai: '东', pinyin: 'dōng', volume: '自然',
      meaning: '东方',
      logic: '画一只两头扎紧的口袋，古人借它表示东方。',
      kid: '一个扎紧口的口袋，古人用它表示东边。',
      adult: '甲骨「东」象两端扎束的口袋，借为东方之东；旧说谓日升木中。',
      bone: '东方曰析',
      gloss: '东方之神名叫析。'
    },
    {
      id: 'nan2', glyph: 'nan2', kai: '南', pinyin: 'nán', volume: '自然',
      meaning: '南方',
      logic: '画一件古乐器，上小下大，古人借它表示南方。',
      kid: '一件上小下大的古乐器，古人用它表示南边。',
      adult: '甲骨「南」象古代乐器之形，借以表示南方。',
      bone: '',
      gloss: '「南」本是乐器，后来借去表示方向。'
    },
    {
      id: 'xi2', glyph: 'xi2', kai: '西', pinyin: 'xī', volume: '自然',
      meaning: '西方',
      logic: '画一只鸟巢，日落西山时鸟儿归巢，就用它表示西。',
      kid: '树上的鸟窝，太阳落山时鸟儿都回巢了。',
      adult: '甲骨「西」象鸟巢之形，日落鸟归巢，借为西方之西。',
      bone: '',
      gloss: '「西」本是鸟巢，日落归巢，就借去表示西边。'
    },
    {
      id: 'que', glyph: 'que', kai: '雀', pinyin: 'què', volume: '动物',
      meaning: '小雀',
      logic: '上面一个「小」，下面一只短尾鸟，就是小雀。',
      kid: '一只小小鸟，在枝头上蹦蹦跳跳。',
      adult: '甲骨「雀」从小从隹，会小鸟之意。',
      bone: '',
      gloss: '小加隹就是雀：身量小小的鸟。'
    },
    {
      id: 'tun', glyph: 'tun', kai: '豚', pinyin: 'tún', volume: '动物',
      meaning: '小猪',
      logic: '画一头猪，身子圆滚滚，肚子下面还有肉，就是小猪豚。',
      kid: '一头圆滚滚的小猪，走路一扭一扭。',
      adult: '甲骨「豚」从豕从肉，本义为小猪。',
      bone: '',
      gloss: '「豚」是豕旁加肉：养肥了的小猪。'
    },
    {
      id: 'chan', glyph: 'chan', kai: '蝉', pinyin: 'chán', volume: '动物',
      meaning: '知了',
      logic: '画一只蝉：大大的眼睛，薄薄的翅膀，趴在树上。',
      kid: '一只知了，趴在树上「知了知了」地叫。',
      adult: '甲骨「蝉」象蝉形，突出其大目与薄翼。',
      bone: '',
      gloss: '蝉就是知了，古人早已把它画进了字里。'
    },
    {
      id: 'tian2', glyph: 'tian2', kai: '天', pinyin: 'tiān', volume: '人体',
      meaning: '头顶',
      logic: '一个正面站立的人，头顶上画一横，指出人的头顶。',
      kid: '一个人站得直直的，头顶上画一道，就是「天」。',
      adult: '甲骨「天」在「大」（人）头上加一横，指人之顶，本义为头顶。',
      bone: '天邑商',
      gloss: '商王朝的大邑。'
    },
    {
      id: 'bu', glyph: 'bu', kai: '步', pinyin: 'bù', volume: '人体',
      meaning: '行走',
      logic: '画一前一后两只脚印，一步一步往前走。',
      kid: '两只脚印一前一后，就是在走路。',
      adult: '甲骨「步」象前后两止（脚）相承，会行走之意。',
      bone: '',
      gloss: '两只脚一前一后，就是「步」。'
    },
    {
      id: 'zou', glyph: 'zou', kai: '走', pinyin: 'zǒu', volume: '人体',
      meaning: '奔跑',
      logic: '一个人甩开双臂，脚下生风，就是跑。',
      kid: '一个人甩着胳膊跑起来，就是「走」。',
      adult: '甲骨「走」从夭（摆臂的人）从止，会奔跑之意，古义为跑。',
      bone: '',
      gloss: '古时的「走」是跑，慢慢走才叫「行」。'
    },
    {
      id: 'mi', glyph: 'mi', kai: '米', pinyin: 'mǐ', volume: '器物',
      meaning: '米粒',
      logic: '中间一横一竖，四周围着米粒，就是散落的米。',
      kid: '一粒一粒的白米，撒在簸箕里。',
      adult: '甲骨「米」象米粒散布之形，中作十字，四周点粒。',
      bone: '',
      gloss: '「米」画的是散开的米粒，后来才专指稻米。'
    },
    {
      id: 'dou3', glyph: 'dou3', kai: '斗', pinyin: 'dǒu', volume: '器物',
      meaning: '量斗',
      logic: '一把带长柄的勺子，用来舀粮量米。',
      kid: '一把大勺子，舀米舀水都靠它。',
      adult: '甲骨「斗」象带柄的量器之形，本义为舀酒量粮的斗。',
      bone: '',
      gloss: '「斗」是带柄的量器，北斗七星就像一把斗。'
    },
    {
      id: 'pin', glyph: 'pin', kai: '品', pinyin: 'pǐn', volume: '器物',
      meaning: '众多',
      logic: '三张嘴摆在一起，表示东西很多、一样一样地品。',
      kid: '三个小口排排坐，表示东西很多。',
      adult: '甲骨「品」从三口，会众多之意，卜辞中亦用为祭名。',
      bone: '',
      gloss: '三个口就是「品」：众物罗列，逐一品尝。'
    },
    {
      id: 'yi', glyph: 'yi', kai: '邑', pinyin: 'yì', volume: '器物',
      meaning: '城邑',
      logic: '上面一座城，下面一个人跪坐着，就是人聚居的邑。',
      kid: '一座小城，城里住着人，就是「邑」。',
      adult: '甲骨「邑」上为城邑之形，下为跪坐之人，会城邑之意。',
      bone: '作邑',
      gloss: '营建城邑。'
    },
    {
      id: 'gong3', glyph: 'gong3', kai: '工', pinyin: 'gōng', volume: '器物',
      meaning: '工具',
      logic: '画一把带柄的工具，上横下横，中间是柄。',
      kid: '一把干活用的工具，方方正正的。',
      adult: '甲骨「工」象工具之形，本义为工具，引申为工匠。',
      bone: '',
      gloss: '「工」本是工具，拿工具的人就是工匠。'
    },
    {
      id: 'sheng', glyph: 'sheng', kai: '升', pinyin: 'shēng', volume: '器物',
      meaning: '量升',
      logic: '一把小勺伸进容器里舀东西，舀一下就是一升。',
      kid: '用小勺舀一下，就是一升米。',
      adult: '甲骨「升」象以斗挹取之形，本义为量器，引申为上升。',
      bone: '',
      gloss: '「升」是舀取的量器，一升就是舀一下。'
    }
  ];

  var LEVELS = [
    {
      char: 'ri', title: '第一契', moves: 20,
      learn: ['ri', 'yun', 'yu'],
      req: [{ id: 'ri', n: 10 }],
      pool: ['ri', 'yue', 'shan', 'shui', 'mu', 'tian'],
      spirit: []
    },
    {
      char: 'yue', title: '第二契', moves: 20,
      learn: ['yue', 'chuan', 'shi'],
      req: [{ id: 'yue', n: 10 }],
      pool: ['ri', 'yue', 'shan', 'shui', 'mu', 'huo'],
      spirit: ['ri']
    },
    {
      char: 'shan', title: '第三契', moves: 22,
      learn: ['shan', 'tu', 'tian'],
      req: [{ id: 'shan', n: 10 }],
      pool: ['ri', 'yue', 'shan', 'shui', 'mu', 'huo', 'shi'],
      spirit: ['ri', 'yue']
    },
    {
      char: 'shui', title: '第四契', moves: 24,
      learn: ['shui', 'she', 'yufish'],
      req: [{ id: 'shui', n: 10 }],
      pool: ['ri', 'yue', 'shan', 'shui', 'huo', 'chuan', 'shi', 'mu'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'mu', title: '第五契', moves: 22,
      learn: ['mu', 'zhu', 'cai'],
      req: [{ id: 'mu', n: 11 }],
      pool: ['ri', 'shan', 'shui', 'mu', 'huo', 'tian', 'ren'],
      spirit: ['ri', 'yue', 'shui']
    },
    {
      char: 'huo', title: '第六契', moves: 22,
      learn: ['huo', 'ren', 'da'],
      req: [{ id: 'huo', n: 11 }],
      pool: ['shui', 'mu', 'huo', 'tu', 'shi', 'ren', 'tian'],
      spirit: ['ri', 'shan', 'mu']
    },
    {
      char: 'lin', title: '第七契', moves: 24,
      learn: ['lin', 'niao', 'niu'],
      req: [{ id: 'mu', n: 20 }],
      pool: ['mu', 'mu', 'shui', 'huo', 'tian', 'ren', 'yu'],
      spirit: ['ri', 'shui', 'mu']
    },
    {
      char: 'ming', title: '第八契', moves: 26,
      learn: ['ming', 'mueye', 'kou'],
      req: [{ id: 'ri', n: 15 }, { id: 'yue', n: 15 }],
      pool: ['ri', 'yue', 'ri', 'yue', 'shui', 'mu', 'yun', 'yu'],
      spirit: ['ri', 'yue', 'mu']
    },
    {
      char: 'xiu', title: '第九契', moves: 26,
      learn: ['xiu', 'an', 'hao'],
      req: [{ id: 'ren', n: 15 }, { id: 'mu', n: 15 }],
      pool: ['ren', 'mu', 'ren', 'mu', 'shui', 'tian', 'niao', 'yufish'],
      spirit: ['ri', 'mu', 'ren']
    },
    {
      char: 'sen', title: '第十契', moves: 28,
      learn: ['sen', 'yang', 'qiu'],
      req: [{ id: 'mu', n: 24 }],
      pool: ['mu', 'mu', 'mu', 'shui', 'tu', 'huo', 'tian', 'ren', 'zhu'],
      spirit: ['ri', 'yue', 'mu', 'lin']
    },
    {
      char: 'xing', title: '第十一契', moves: 24,
      learn: ['xing', 'feng', 'lei'],
      req: [{ id: 'xing', n: 10 }],
      pool: ['xing', 'xing', 'feng', 'lei', 'ri', 'yue', 'yun'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'quan', title: '第十二契', moves: 26,
      learn: ['quan', 'gu', 'qiuqiu'],
      req: [{ id: 'quan', n: 11 }],
      pool: ['quan', 'quan', 'gu', 'qiuqiu', 'shui', 'tu', 'shan'],
      spirit: ['ri', 'yue', 'shui']
    },
    {
      char: 'ma', title: '第十三契', moves: 26,
      learn: ['ma', 'quangou', 'shizhu'],
      req: [{ id: 'ma', n: 11 }],
      pool: ['ma', 'ma', 'quangou', 'shizhu', 'niu', 'yang', 'niao'],
      spirit: ['ri', 'mu', 'tu']
    },
    {
      char: 'er', title: '第十四契', moves: 28,
      learn: ['er', 'xin', 'shou'],
      req: [{ id: 'er', n: 12 }],
      pool: ['er', 'er', 'xin', 'shou', 'ren', 'mueye', 'kou'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'zhou', title: '第十五契', moves: 30,
      learn: ['zhou', 'gong', 'che'],
      req: [{ id: 'zhou', n: 12 }],
      pool: ['zhou', 'zhou', 'gong', 'che', 'tian', 'ren', 'shui'],
      spirit: ['ri', 'yue', 'shui']
    },
    {
      char: 'tiger', title: '第十六契', moves: 30,
      learn: ['tiger', 'deer', 'rabbit'],
      req: [{ id: 'tiger', n: 12 }],
      pool: ['tiger', 'tiger', 'deer', 'rabbit', 'ma', 'quangou', 'shizhu'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'turtle', title: '第十七契', moves: 30,
      learn: ['turtle', 'shell', 'horn'],
      req: [{ id: 'turtle', n: 12 }],
      pool: ['turtle', 'turtle', 'shell', 'horn', 'yufish', 'niao', 'ma'],
      spirit: ['ri', 'shui', 'yu']
    },
    {
      char: 'woman', title: '第十八契', moves: 30,
      learn: ['woman', 'child', 'stand'],
      req: [{ id: 'woman', n: 12 }],
      pool: ['woman', 'woman', 'child', 'stand', 'ren', 'er', 'shou'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'gate', title: '第十九契', moves: 32,
      learn: ['gate', 'robe', 'knife'],
      req: [{ id: 'gate', n: 13 }],
      pool: ['gate', 'gate', 'robe', 'knife', 'zhou', 'gong', 'che'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'daggeraxe', title: '第二十契', moves: 32,
      learn: ['daggeraxe', 'tripod', 'jade'],
      req: [{ id: 'daggeraxe', n: 13 }],
      pool: ['daggeraxe', 'daggeraxe', 'tripod', 'jade', 'gate', 'knife', 'che'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'xi', title: '第二十一契', moves: 30,
      learn: ['xi', 'jing', 'qi'],
      req: [{ id: 'xi', n: 12 }],
      pool: ['xi', 'xi', 'jing', 'qi', 'xing', 'feng', 'lei'],
      spirit: ['ri', 'yue', 'xing']
    },
    {
      char: 'xiang', title: '第二十二契', moves: 30,
      learn: ['xiang', 'yan', 'chong'],
      req: [{ id: 'xiang', n: 12 }],
      pool: ['xiang', 'xiang', 'yan', 'chong', 'tiger', 'deer', 'ma'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'chi', title: '第二十三契', moves: 32,
      learn: ['chi', 'mei', 'zi'],
      req: [{ id: 'chi', n: 13 }],
      pool: ['chi', 'chi', 'mei', 'zi', 'er', 'mueye', 'kou'],
      spirit: ['ri', 'ren', 'mueye']
    },
    {
      char: 'zun', title: '第二十四契', moves: 32,
      learn: ['zun', 'jue', 'hu'],
      req: [{ id: 'zun', n: 13 }],
      pool: ['zun', 'zun', 'jue', 'hu', 'tripod', 'jade', 'daggeraxe'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'wang', title: '第二十五契', moves: 32,
      learn: ['wang', 'ce', 'broom'],
      req: [{ id: 'wang', n: 13 }],
      pool: ['wang', 'wang', 'ce', 'broom', 'gate', 'knife', 'zhu'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'guang', title: '第二十六契', moves: 30,
      learn: ['guang', 'hong', 'snow'],
      req: [{ id: 'guang', n: 12 }],
      pool: ['guang', 'guang', 'hong', 'snow', 'ri', 'yue', 'xing'],
      spirit: ['ri', 'yue', 'xing']
    },
    {
      char: 'long', title: '第二十七契', moves: 30,
      learn: ['long', 'zhui', 'yu2'],
      req: [{ id: 'long', n: 12 }],
      pool: ['long', 'long', 'zhui', 'yu2', 'niao', 'yan', 'ma'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'blood', title: '第二十八契', moves: 32,
      learn: ['blood', 'lao', 'shen'],
      req: [{ id: 'blood', n: 13 }],
      pool: ['blood', 'blood', 'lao', 'shen', 'ren', 'mueye', 'shou'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'arrow', title: '第二十九契', moves: 32,
      learn: ['arrow', 'jin', 'you'],
      req: [{ id: 'arrow', n: 13 }],
      pool: ['arrow', 'arrow', 'jin', 'you', 'knife', 'gong', 'che'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'min', title: '第三十契', moves: 32,
      learn: ['min', 'dou', 'gu2'],
      req: [{ id: 'min', n: 13 }],
      pool: ['min', 'min', 'dou', 'gu2', 'tripod', 'zun', 'jue'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'he2', title: '第三十一契', moves: 30,
      learn: ['he2', 'mai', 'sang'],
      req: [{ id: 'he2', n: 12 }],
      pool: ['he2', 'he2', 'mai', 'sang', 'shui', 'tu', 'ri'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'shu3', title: '第三十二契', moves: 30,
      learn: ['shu3', 'ta', 'ji'],
      req: [{ id: 'shu3', n: 12 }],
      pool: ['shu3', 'shu3', 'ta', 'ji', 'ma', 'quangou', 'niao'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'you3', title: '第三十三契', moves: 32,
      learn: ['you3', 'zhi3', 'mu3'],
      req: [{ id: 'you3', n: 13 }],
      pool: ['you3', 'you3', 'zhi3', 'mu3', 'ren', 'mueye', 'kou'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'fou', title: '第三十四契', moves: 32,
      learn: ['fou', 'li4', 'yu4'],
      req: [{ id: 'fou', n: 13 }],
      pool: ['fou', 'fou', 'li4', 'yu4', 'min', 'dou', 'tripod'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'jia', title: '第三十五契', moves: 32,
      learn: ['jia', 'gong2', 'hu4'],
      req: [{ id: 'jia', n: 13 }],
      pool: ['jia', 'jia', 'gong2', 'hu4', 'gate', 'robe', 'zhou'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'chun', title: '第三十六契', moves: 30,
      learn: ['chun', 'qiu2', 'dong'],
      req: [{ id: 'chun', n: 12 }],
      pool: ['chun', 'chun', 'qiu2', 'dong', 'ri', 'mu', 'shui'],
      spirit: ['ri', 'yue', 'mu']
    },
    {
      char: 'hu2', title: '第三十七契', moves: 30,
      learn: ['hu2', 'feng2', 'bao'],
      req: [{ id: 'hu2', n: 12 }],
      pool: ['hu2', 'hu2', 'feng2', 'bao', 'ma', 'quangou', 'tiger'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'ye', title: '第三十八契', moves: 32,
      learn: ['ye', 'er2', 'xiong'],
      req: [{ id: 'ye', n: 13 }],
      pool: ['ye', 'ye', 'er2', 'xiong', 'ren', 'mueye', 'kou'],
      spirit: ['ri', 'ren', 'mueye']
    },
    {
      char: 'wu', title: '第三十九契', moves: 32,
      learn: ['wu', 'shi2', 'qie'],
      req: [{ id: 'wu', n: 13 }],
      pool: ['wu', 'wu', 'shi2', 'qie', 'min', 'dou', 'fou'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'si', title: '第四十契', moves: 32,
      learn: ['si', 'peng', 'xin2'],
      req: [{ id: 'si', n: 13 }],
      pool: ['si', 'si', 'peng', 'xin2', 'knife', 'daggeraxe', 'arrow'],
      spirit: ['ri', 'yue', 'shan']
    },
    {
      char: 'he', title: '第四十一契', moves: 30,
      learn: ['he', 'ye3', 'yang2'],
      req: [{ id: 'he', n: 12 }],
      pool: ['he', 'he', 'ye3', 'yang2', 'shui', 'tu', 'ri'],
      spirit: ['ri', 'shui', 'tu']
    },
    {
      char: 'shu2', title: '第四十二契', moves: 30,
      learn: ['shu2', 'mi2', 'zhi4'],
      req: [{ id: 'shu2', n: 12 }],
      pool: ['shu2', 'shu2', 'mi2', 'zhi4', 'deer', 'ma', 'niao'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'fu', title: '第四十三契', moves: 32,
      learn: ['fu', 'li', 'nan'],
      req: [{ id: 'fu', n: 13 }],
      pool: ['fu', 'fu', 'li', 'nan', 'ren', 'mueye', 'kou'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'jing2', title: '第四十四契', moves: 32,
      learn: ['jing2', 'jin2', 'zhong'],
      req: [{ id: 'jing2', n: 13 }],
      pool: ['jing2', 'jing2', 'jin2', 'zhong', 'fou', 'min', 'dou'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'gao', title: '第四十五契', moves: 32,
      learn: ['gao', 'jing3', 'xing2'],
      req: [{ id: 'gao', n: 13 }],
      pool: ['gao', 'gao', 'jing3', 'xing2', 'jia', 'gong2', 'hu4'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'dong2', title: '第四十六契', moves: 30,
      learn: ['dong2', 'nan2', 'xi2'],
      req: [{ id: 'dong2', n: 12 }],
      pool: ['dong2', 'dong2', 'nan2', 'xi2', 'ri', 'mu', 'shui'],
      spirit: ['ri', 'yue', 'mu']
    },
    {
      char: 'que', title: '第四十七契', moves: 30,
      learn: ['que', 'tun', 'chan'],
      req: [{ id: 'que', n: 12 }],
      pool: ['que', 'que', 'tun', 'chan', 'niao', 'zhui', 'ma'],
      spirit: ['ri', 'mu', 'shan']
    },
    {
      char: 'tian2', title: '第四十八契', moves: 32,
      learn: ['tian2', 'bu', 'zou'],
      req: [{ id: 'tian2', n: 13 }],
      pool: ['tian2', 'tian2', 'bu', 'zou', 'ren', 'da', 'zhi3'],
      spirit: ['ri', 'ren', 'mu']
    },
    {
      char: 'mi', title: '第四十九契', moves: 32,
      learn: ['mi', 'dou3', 'pin'],
      req: [{ id: 'mi', n: 13 }],
      pool: ['mi', 'mi', 'dou3', 'pin', 'he2', 'mai', 'wu'],
      spirit: ['ri', 'yue', 'tu']
    },
    {
      char: 'yi', title: '第五十契', moves: 40,
      learn: ['yi', 'gong3', 'sheng'],
      req: [{ id: 'yi', n: 16 }],
      pool: ['yi', 'yi', 'gong3', 'sheng', 'min', 'dou', 'jing2'],
      spirit: ['ri', 'yue', 'tu']
    }
  ];

  /* 史官手记 · 按已识字数为序解锁 */
  var NOTES = [
    {
      id: 'n1', title: '骨上的第一笔', need: 1,
      body: [
        '三千多年前的商王，遇事先问天。',
        '他把问题刻在龟腹甲或牛肩胛骨上，再用火灼。',
        '骨面「卜」地裂开一道纹，裂纹走向就是回答。',
        '问完、看完，再把这件事刻回骨上——这就是甲骨文。'
      ]
    },
    {
      id: 'n2', title: '贞人是谁', need: 2,
      body: [
        '卜辞开头常有一个「贞」字，意思是问。',
        '念出这声「贞」的，是贞人——商朝的史官。',
        '他管占卜、记年月、抄诰命，也把每次问答刻进骨头。',
        '所以甲骨文不是一本书，是三千年前的档案。'
      ]
    },
    {
      id: 'n3', title: '今日不雨', need: 3,
      body: [
        '一句完整的卜辞，大致分四段。',
        '前辞记日子和贞人，命辞是问题，占辞是判断，验辞是后来验的事。',
        '「贞：今日不雨？」六个字，日子和问题都交代了。',
        '你识得日、月、雨，就能自己读这一句。'
      ]
    },
    {
      id: 'n4', title: '月有食', need: 5,
      body: [
        '甲骨里有世界上最早的月食记录之一。',
        '商人见月亮被吞，就记下「月有食」，再问是吉是凶。',
        '他们按天干地支记日，六十天一循环，一直用到今天。'
      ]
    },
    {
      id: 'n5', title: '王往田', need: 7,
      body: [
        '卜辞里的「田」，很多时候不是种地，是田猎。',
        '王带着人进山林追鹿逐豕，既练武，也祭祖。',
        '走到哪里、猎到什么，回来都刻在骨上。'
      ]
    },
    {
      id: 'n6', title: '甲骨的旅程', need: 10,
      body: [
        '甲骨出土于安阳小屯，曾被当作「龙骨」卖进药铺。',
        '一八九九年，王懿荣在药材上认出古字，甲骨文才重见天日。',
        '如今约十五万片甲骨散在各地，仍有近一半的字没有认出来。',
        '你认下的每一个字，都是接着往下读的一把钥匙。'
      ]
    },
    {
      id: 'n7', title: '受年', need: 20,
      body: [
        '卜辞常问「受年」——今年会有好收成吗？',
        '风雨、虫害、土地，商王都要先问过鬼神。',
        '「年」的本义是谷熟：一个人背着禾，就是收成。',
        '所以「年」不只是时间，也是饭碗。'
      ]
    },
    {
      id: 'n8', title: '王其田', need: 30,
      body: [
        '卜辞里的「田」，很多时候不是种地，而是田猎。',
        '王带着人进山林追鹿逐豕，既练兵，也祭祖。',
        '去哪里、获到什么，回来都刻在骨上。',
        '「王其田」三个字，就是一场狩猎的开始。'
      ]
    },
    {
      id: 'n9', title: '征与伐', need: 45,
      body: [
        '商王对周边方国用兵，先要占卜吉凶。',
        '「伐」字从人持戈，卜辞里常见「王伐某方」。',
        '打完仗，俘获的人与物也会记在骨上。',
        '战争、祭祀、农业，是卜辞里最多见的几件事。'
      ]
    },
    {
      id: 'n10', title: '字还会长大', need: 60,
      body: [
        '甲骨文之后，还有金文、小篆、隶书、楷书。',
        '有的字越写越简，有的字加上了形旁或声旁。',
        '但「日」「月」「山」「水」这些字，三千年没有换过骨相。',
        '你写下的每一笔，都是这条长河的下一段。'
      ]
    },
    {
      id: 'n11', title: '从骨到纸', need: 75,
      body: [
        '商人在骨上刻字，周人把字铸在铜器上。',
        '再往后是竹简、帛书、纸张，字才走进寻常人家。',
        '载体换了又换，笔意却一路传下来。',
        '识得七十五字，你已经能读懂一小片商代的天空。'
      ]
    },
    {
      id: 'n12', title: '字与礼', need: 90,
      body: [
        '青铜器上的字，常以「子子孙孙永宝用」收尾。',
        '一件鼎、一只爵，铸上铭文，就成了家族的凭据。',
        '所以「尊」「爵」「鼎」这些字，起初都只是器物。',
        '识得九十字，你已能读懂不少青铜器上的句子。'
      ]
    },
    {
      id: 'n13', title: '屋下有猪', need: 105,
      body: [
        '甲骨文的「家」，是屋顶下面画一头猪。',
        '商人把猪养在屋里，有屋有畜，才算安顿下来。',
        '「宫」是相连的房屋，「户」是单扇的门。',
        '识得一百零五字，屋子、田地、牲畜，你都能叫出名字了。'
      ]
    },
    {
      id: 'n14', title: '一年与一朋', need: 120,
      body: [
        '商人按天干地支记日，也按四季安排一年的活计。',
        '春种、秋收、冬藏，字里就藏着这些日子。',
        '贝是商代的钱，两串贝叫一朋，朋也就是「同串」的人。',
        '识得一百二十字，一年四季、人情往来，你都能写出来了。'
      ]
    },
    {
      id: 'n15', title: '路与城', need: 135,
      body: [
        '「行」在甲骨里是一道路口，四方都通。',
        '「邑」是城，上面一座城，下面一个人跪坐着。',
        '「京」是建在高丘上的大屋，「高」是建在高台上的房子。',
        '路、井、城、屋，商人的世界就这样一点点搭起来。'
      ]
    },
    {
      id: 'n16', title: '五十契之后', need: 150,
      body: [
        '五十契走完，你已识得一百五十个甲骨字。',
        '这些字里，有太阳月亮，有飞鸟走兽，也有刀斧鼎彝。',
        '今天约十五万片甲骨散在各地，仍有近一半的字没有认出来。',
        '往后的字，就要靠下一代的识字人去骨头上找了。'
      ]
    }
  ];

  var BY_ID = {};
  var INDEX = {};
  for (var i = 0; i < CHARS.length; i++) {
    BY_ID[CHARS[i].id] = CHARS[i];
    INDEX[CHARS[i].id] = i;
  }

  function char(id) { return BY_ID[id]; }
  function typeOf(id) { return INDEX[id]; }

  return {
    CHARS: CHARS,
    LEVELS: LEVELS,
    NOTES: NOTES,
    BY_ID: BY_ID,
    INDEX: INDEX,
    char: char,
    typeOf: typeOf
  };
});
