export interface PhotoSpec {
  id: number;
  name: string;
  size: string;
}

export const photoSpecs: PhotoSpec[] = [
  {
    id: 1,
    name: "标准二寸",
    size: "35mm×49mm"
  },
  {
    id: 2,
    name: "标准一寸", 
    size: "25mm×35mm"
  },
  {
    id: 3,
    name: "公务员考试规格",
    size: "33mm×48mm"
  },
  {
    id: 4, 
    name: "护照照片规格",
    size: "33mm×48mm"
  }
];
