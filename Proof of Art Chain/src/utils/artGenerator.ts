import { Transaction, ArtPattern, Shape } from '../types/blockchain';

export const generateArtFromTransactions = (
  transactions: Transaction[],
  hash: string
): ArtPattern => {
  const shapes: Shape[] = [];
  const hashNumbers = hash.match(/.{2}/g)?.map(hex => parseInt(hex, 16)) || [];

  // Generate background color from first 6 characters of hash
  const background = `#${hash.slice(0, 6)}`;

  transactions.forEach((tx, index) => {
    // Use transaction amount and timestamp to generate shapes
    const baseX = (hashNumbers[index % hashNumbers.length] / 255) * 400;
    const baseY = (hashNumbers[(index + 1) % hashNumbers.length] / 255) * 400;
    
    // Create multiple shapes for each transaction
    shapes.push(
      {
        type: 'circle',
        x: baseX,
        y: baseY,
        size: (tx.amount * 10) % 100 + 20,
        color: tx.color,
      },
      {
        type: 'rectangle',
        x: baseX + 50,
        y: baseY - 50,
        size: (tx.amount * 5) % 60 + 10,
        color: tx.color,
        rotation: (tx.timestamp % 360),
      },
      {
        type: 'line',
        x: baseX - 25,
        y: baseY + 25,
        size: (tx.amount * 15) % 150 + 30,
        color: tx.color,
        rotation: (tx.timestamp % 180),
      }
    );
  });

  return { shapes, background };
};

export const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};