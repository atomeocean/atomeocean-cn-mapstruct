// Add edge cases to conditionExpression to @SubclassMapping

class SubclassMapping{
    public int[] findDiagonalOrder(int[][] mat) {
        if(mat == null || mat.length == 0 || mat[0].length == 0) {
            return new int[0];
        }
        
        int m = mat.length;
        int n = mat[0].length;
        int r = 0;
        int c = 0;
        boolean up = true;
        int[] res = new int[m * n];
        int i = 0;

        while(r < m && c < n) {
            res[i++] = mat[r][c];

            int newR = r + (up ? -1 :1);
            int newC = c + (up ? 1 : -1);

            if(newR < 0 || newR >= m || newC < 0 || newC >= n) {
                if(up) {
                    r += (c == n - 1) ? 1 : 0;
                    c += (c < n - 1) ? 1 : 0;
                } else {
                    c += (r == m - 1) ? 1 : 0;
                    r += (r < m - 1) ? 1 : 0;
                }
                up = !up;
            } else {
                r = newR;
                c = newC;
            }
        }
        return res;
    }
}