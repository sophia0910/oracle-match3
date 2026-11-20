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
