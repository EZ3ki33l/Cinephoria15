async function getData() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function AboutData() {
  await getData();
  return null;
} 