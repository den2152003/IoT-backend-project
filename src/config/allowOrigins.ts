export interface TAllowOrigins {
  protocol: ("http" | "https")[];
  domain: string;
  ports: number[];
}

const allowOrigins: TAllowOrigins[] = [
  {
    protocol: ["http", "https"],
    domain: "127.0.0.1",
    ports: [3000, 3080]
  },
  {
    protocol: ["http", "https"],
    domain: "localhost",
    ports: [3000, 3080, 5173, 4173]
  },
  {
    protocol: ["http", "https"],
    domain: "192.168.1.209",
    ports: [4173]
  },
  {
    protocol: ["http", "https"],
    domain: "sub.domain.vn",
    ports: [80, 443]
  },
  {
    protocol: ["http", "https"],
    domain: "87610jd3-3030.asse.devtunnels.ms",
    ports: [80, 443, 3080, 5173]
  }
];

export default allowOrigins;
