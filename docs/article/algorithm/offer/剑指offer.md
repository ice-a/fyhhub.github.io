# 剑指offer

### T01:二维数组中查找

在一个二维数组中(每个一维数组的长度相同),每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

```java
	/**
     * 以左下角为起点开始搜索target，当前位置大于target则向上平移，
     * 当前位置小于target则向左平移，等于target则说明找到
     *
     * @param arr
     * @param target
     * @return
     */
    boolean find(int[][] arr, int target) {
        int i = 0;
        int j = arr[0].length - 1;
        while (i < arr.length && j > 0) {
            if (arr[i][j] > target) {
                j--;
            } else if (arr[i][j] < target) {
                i++;
            } else {
                return true;
            }
        }
        return false;
    }
```

### T03:从尾到头打印链表

输入一个链表，按链表值从尾到头的顺序返回一个List。

```java
	/**
     * 利用栈的先进后出性质，将链表依次压栈，然后依次出栈
     * @param node
     * @return
     */
    List<Integer> printReverseList(ListNode node) {
        List<Integer> list = new ArrayList<>();
        Stack<Integer> stack = new Stack<>();
        while (node != null) {
            stack.push(node.var);
            node = node.next;
        }
        while (!stack.isEmpty()) {
            list.add(stack.pop());
        }
        return list;
    }

 	/**
     * 递归思路,找到尾节点再存，始终存，反转链表的变形
     * @param node
     * @return
     */
    List<Integer> printReverseList2(ListNode node) {
        List<Integer> list = new ArrayList<>();
        if (node != null) {
            // 链表的下一个节点不为空就一直遍历寻找
            if (node.next != null) {
                list = printReverseList2(node.next);
            }
            // 找到尾节点，存入结果集
            list.add(node.var);
        }
        return list;
    }
```

### T09:变态跳台阶

一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

```java
	/**
     * 动态规划，a记录当前层级跳法总数，
     * b记录下一级的跳法总数
     *
     * @param target
     * @return
     */
    public int btJumpFloor(int target) {
        if (target <= 0) {
            return 0;
        }
        if (target == 1) {
            return 1;
        }
        int a = 1, b = 2;
        for (int i = 0; i < target; i++) {
            b = 2 * a;
            a = b;
        }
        return b;
    }

    /**
     * 数学归纳法
     *
     * @param target
     * @return
     */
    public int btJumpFloor2(int target) {
        return (int) Math.pow(2, target - 1);
    }
```

### T11:二进制中1的个数

输入一个整数，输出该数二进制表示中1的个数。其中负数用补码表示。

```java
	/**
     * 任何数的二进制最起码有一个1，任何数与其减一的数相与的结果
     * 会消耗一个1，统计出消耗1的个数
     *
     * @param num
     * @return
     */
    int numberOfOne(int num) {
        int count = 0;
        while (num != 0) {
            count++;
            num = (num - 1) & num;
        }
        return count;
    }
```

### T15:反转链表

输入一个链表，反转链表后，输出新链表的表头。

```java
/**
     * 借助两个链表，next保存下一个节点，
     * pre始终保存逆序结果
     *
     * @param head
     * @return
     */
    ListNode reverse(ListNode head) {
        ListNode pre = null;
        ListNode next = null;
        while (head != null) {
            next = head.next;
            head.next = pre;
            pre = head;
            head.next = next;
        }
        return pre;
    }

    /**
     * 利用栈先进后出，先依次存入链表
     * 再遍历栈，依次弹出元素
     *
     * @param head
     * @return
     */
    ListNode reverse2(ListNode head) {
        Stack<ListNode> stack = new Stack<>();
        ListNode node = head;
        while (head != null) {
            stack.push(head);
            head = head.next;
        }
        head = node;
        while (!stack.isEmpty()) {
            node.next = stack.pop();
            node = node.next;
        }
        return head;
    }
```

### T16:合并两个排序的链表

输入两个单调递增的链表，输出两个链表合成后的链表，当然我们需要合成后的链表满足单调不减规则。

```java
	/**
     * 递归思路，从头开始比较两个链表，从值小者开始存
     *
     * @param n1
     * @param n2
     * @return
     */
    ListNode merge(ListNode n1, ListNode n2) {
        if (n1 == null) {
            return n2;
        }
        if (n2 == null) {
            return n1;
        }
        ListNode pre = null;
        if (n1.var > n2.var) {
            pre = n2;
            pre.next = merge(n1, n2.next);
        } else {
            pre = n1;
            pre.next = merge(n1.next, n2);
        }
        return pre;
    }
```

### T18:二叉树的镜像

操作给定的二叉树，将其变换为源二叉树的镜像。

```java
	/**
     * 递归思想，首先交换根结点的左右子树，
     * 递归其左右子树，再交互当前结点的左右子树
     *
     * @param node
     */
    void mirror(TreeNode node) {
        if (node != null) {
            TreeNode tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            if (node.right != null) {
                mirror(node.right);
            }
            if (node.left != null) {
                mirror(node.left);
            }
        }
    }
```

### T20:包含min函数的栈

定义栈的数据结构，请在该类型中实现一个能够得到栈中所含最小元素的min函数（时间复杂度应为O（1））。

```java
	/**
     * 利用两个栈，一个栈存数据，另一个栈存最小值，
     * 栈顶元素就是最小值，获取最小值时直接调用最
     * 小栈的peek()方法
     */

    Stack<Integer> stack = new Stack<>();
    Stack<Integer> min = new Stack<>();
    Integer tmp = null;

    void push(int num) {
        if (tmp != null) {
            if (tmp > num) {
                min.push(tmp);
            }
            stack.push(tmp);
        } else {
            tmp = num;
            stack.push(tmp);
            min.push(tmp);
        }
    }

    int pop() {
        int top = stack.pop();
        int num = min.pop();
        if (top != num) {
            min.push(num);
        }
        return top;
    }

    int top() {
        return stack.peek();
    }

    int min() {
        return min.peek();
    }
```

### T22:从上往下打印二叉树

从上往下打印出二叉树的每个节点，同层节点从左至右打印。

```java
	/**
     * 借助一个队列实现，从根节点开始存，
     * 然后循环中依次存入左右子树
     *
     * @param root
     * @return
     */
    List<Integer> printTree(TreeNode root) {
        List<Integer> list = new ArrayList<>();
        if (root == null) {
            return list;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            // 返回最先存入的元素并删除
            TreeNode node = queue.poll();
            list.add(node.val);
            // 左子树入队
            if (node.left != null) {
                queue.add(node.left);
            }
            // 右子树入队
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        return list;
    }
```

### T23:二叉搜索树的后序遍历序列

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历的结果。如果是则输出Yes,否则输出No。假设输入的数组的任意两个数字都互不相同。

```java
	boolean verifyBST(int[] sequence) {
        if (sequence.length == 0) {
            return false;
        }
        return isBST(sequence, 0, sequence.length - 1);
    }

    /**
     * 后序遍历序列的最后一个节点是根结点，根结点之
     * 前分为左右子树，满足左子树元素都小于根结点，
     * 右子树元素都大于根结点,按照此思路递归左子树
     * 和右子树是否也满足
     *
     * @param sequence
     * @param start
     * @param end
     * @return
     */
    private boolean isBST(int[] sequence, int start, int end) {
        if (start >= end) {
            return true;
        }
        int i = end - 1;
        //从倒数第二个元素开始向前遍历，找到右子树与左子树临界点
        while (sequence[i] > sequence[end] && i > start) {
            i--;
        }
        //遍历左子树，如果含大于根节点元素即返回false
        for (int j = start; j < i; j++) {
            if (sequence[j] > sequence[end]) {
                return false;
            }
        }
        //递归左子树与右子树
        return isBST(sequence, start, i) && isBST(sequence, i + 1, end - 1);
    }
```

### T24:二叉树中和为某一值的路径

输入一颗二叉树的跟节点和一个整数，打印出二叉树中结点值的和为输入整数的所有路径。路径定义为从树的根结点开始往下一直到叶结点所经过的结点形成一条路径。(注意: 在返回值的list中，数组长度大的数组靠前)

```java
	List<List<Integer>> resultList = new ArrayList<>();
    List<Integer> list = new ArrayList<>();

    /**
     * 递归左右子树，target减去当前结点值，
     * 如果target为0且为叶子节点则此路径满足条件，存入结果集
     *
     * @param node
     * @param target
     * @return
     */
    List<List<Integer>> findPath(TreeNode node, int target) {
        if (node == null) {
            return resultList;
        }
        // 存入当前结点
        list.add(node.val);
        // target减去当前结点值
        target -= node.val;
        // 如果target为0且当前结点为叶子结点则满足条件
        if (target == 0 && node.left == null && node.right == null) {
            resultList.add(list);
        }
        // 遍历左子树
        if (node.left != null) {
            findPath(node.left, target);
        }
        // 遍历右子树
        if (node.right != null) {
            findPath(node.right, target);
        }
        // 将此路径末尾元素删除,深度遍历完一条路径后要回退
        list.remove(list.size() - 1);
        return resultList;
    }
```

### T25:复杂链表的复制

输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针指向任意一个节点）返回结果为复制后复杂链表的head。（注意，输出结果中请不要返回参数中的节点引用，否则判题程序会直接返回空）

```java
	/**
     * 分三步:
     * 1.复制每一个节点，如A->B->C->D,
     *      复制后得A->A->B->B->C->C->D->D
     * 2.重新遍历链表，复制老结点的随机指针给新结点，
     *      如A.random = A1.random.next;
     * 3.拆分链表，将链表拆分为原链表和复制后的链表
     *
     * @param head
     * @return
     */
    RandomListNode clone(RandomListNode head) {
        if (head == null) {
            return null;
        }
        RandomListNode pre = head;
        //1.复制每一个节点
        while (pre != null) {
            RandomListNode cloneNode = new RandomListNode(pre.label);
            RandomListNode next = pre.next;
            pre.next = cloneNode;
            cloneNode.next = next;
            pre = next;
        }
        pre = head;
        //2.重新遍历链表，复制老结点的随机指针给新结点
        while (pre != null) {
            pre.next.random = pre.random == null ? null : pre.random.next;
            pre = pre.next.next;
        }
        pre = head;
        RandomListNode clone = head.next;
        //3.拆分链表，将链表拆分为原链表和复制后的链表
        while (pre != null) {
            RandomListNode pClone = pre.next;
            pre.next = pClone.next;
            pClone.next = pClone.next == null ? null : pClone.next.next;
            pre = pre.next;
        }
        return clone;
    }
```

### T26:二叉搜索树与双向链表

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的双向链表。要求不能创建任何新的结点，只能调整树中结点指针的指向。

```java
	/**
     * 双向链表的左边头结点和右边头节点
     */
    TreeNode leftHead = null;
    TreeNode rightHead = null;

    /**
     * 思路:利用递归
     * 1.将左子树构造成双链表，并返回链表头节点。
     * 2.定位至左子树双链表最后一个节点。
     * 3.如果左子树链表不为空的话，将当前root追加到左子树链表。
     * 4.将右子树构造成双链表，并返回链表头节点。
     * 5.如果右子树链表不为空的话，将该链表追加到root节点之后。
     * 6.根据左子树链表是否为空确定返回的节点。
     *
     * @param root
     * @return
     */
    public TreeNode convert1(TreeNode root) {
        // 递归调用叶子节点的左右节点返回null
        if (root == null) {
            return null;
        }
        // 第一次运行时，它会使最左边叶子节点为链表第一个节点
        convert1(root.left);
        if (rightHead == null) {
            leftHead = root;
            rightHead = root;
        } else {
            // 把根节点插入到双向链表右边，rightHead向后移动
            rightHead.right = root;
            root.left = rightHead;
            rightHead = root;
        }
        // 把右叶子节点也插入到双向链表（rightHead已确定，直接插入）
        convert1(root.right);
        // 返回左边头结点
        return leftHead;
    }

    /**
     * 非递归思路:
     * 1.核心是中序遍历的非递归算法，栈实现。
     * 2.修改当前遍历节点与前一遍历节点的指针指向。
     *
     * @param root
     * @return
     */
    public TreeNode Convert2(TreeNode root) {
        if (root == null) {
            return null;
        }
        Stack<TreeNode> stack = new Stack<TreeNode>();
        TreeNode p = root;
        // 用于保存中序遍历序列的上一节点
        TreeNode pre = null;
        boolean isFirst = true;
        while (p != null || !stack.isEmpty()) {
            while (p != null) {
                stack.push(p);
                p = p.left;
            }
            p = stack.pop();
            if (isFirst) {
                // 将中序遍历序列中的第一个节点记为root
                root = p;
                pre = root;
                isFirst = false;
            } else {
                pre.right = p;
                p.left = pre;
                pre = p;
            }
            p = p.right;
        }
        return root;
    }
```

### T33:丑数

把只包含质因子2、3和5的数称作丑数（Ugly Number）。

例如6、8都是丑数，但14不是，因为它包含质因子7。 习惯上我们把1当做是第一个丑数。求按从小到大的顺序的第N个丑数。

```java
/**
 * 穷举 + 归纳
 * 归纳法得出丑数肯定是2，3，4的倍数，通过乘2，3或4可穷举出所有情况
 * @param index
 * @return
 */
int uglyNumber(int index) {
    if (index < 7) {
        return index;
    }
    int[] dp = new int[index];
    dp[0] = 1;
    int i2=0, i3=0, i5=0;
    for (int i = 1; i < index; i++) {
        int next2 = dp[i2] * 2, next3 = dp[i3] * 3, next5 = dp[i5] * 5;
        dp[i] = Math.min(next2, Math.min(next3, next5));
        if (dp[i] == next2) {
            i2++;
        }
        if (dp[i] == next3) {
            i3++;
        }
        if (dp[i] == next5) {
            i5++;
        }
    }
    return dp[index - 1];
}
```

### T36:两个链表的第一个公共结点

输入两个链表，找出它们的第一个公共结点。

```java
	/**
     * 两个链表不相等则循环遍历，直到找到第一个公共结点或同时为null
     *
     * @param h1
     * @param h2
     * @return
     */
    public ListNode findFirstCommonNode(ListNode h1, ListNode h2) {
        ListNode n1 = h1, n2 = h2;
        // n1和n2不相等则循环遍历
        while (n1 != n2) {
            n1 = n1 == null ? h1 : n1.next;
            n2 = n2 == null ? h2 : n2.next;
        }
        return n1;
    }
```

### T38:二叉树的深度

输入一棵二叉树，求该树的深度。从根结点到叶结点依次经过的结点（含根、叶结点）形成树的一条路径，最长路径的长度为树的深度。

```java
	/**
     * 分别递归遍历左右子树，每递归一次，相当于找到了某节
     * 点左子树或者右子树，返回1，最终返回其左右子树最大深度
     *
     * @param node
     * @return
     */
    int treeDepth(TreeNode node) {
        if (node == null) {
            return 0;
        }
        int right = treeDepth(node.right);
        int left = treeDepth(node.left);
        return Math.max(right, left) + 1;
    }
```

### T41:和为S的连续正数序列

小明很喜欢数学,有一天他在做数学作业时,要求计算出9~16的和,他马上就写出了正确答案是100。但是他并不满足于此,他在想究竟有多少种连续的正数序列的和为100(至少包括两个数)。没多久,他就得到另一组连续正数和为100的序列:18,19,20,21,22。现在把问题交给你,你能不能也很快的找出所有和为S的连续正数序列?

```java
    /**
     * 双重循环，外层控制起点位置，内层查找连续正数和
     * 为sum的序列，若大于sum直接跳出内循环，等于则
     * 将list序列存入结果集中。
     *
     * @param target
     * @return
     */
    List<List<Integer>> findContinuousSequence(int target) {
        List<List<Integer>> resut = new ArrayList<>();
        for (int i = 1; i < target / 2 - 1; i++) {
            List<Integer> list = new ArrayList<>();
            int sum = 0;
            for (int j = i; j < target; j++) {
                sum += j;
                list.add(j);
                if (sum == target) {
                    resut.add(list);
                    break;
                } else if (sum > target) {
                    break;
                }
            }
        }
        return resut;
    }
```

### T42:和为S的两个数字

输入一个递增排序的数组和一个数字S，在数组中查找两个数，使得他们的和正好是S，如果有多对数字的和等于S，输出两个数的乘积最小的。

```java
	/**
     * 有序使用二分法，设置首尾指针，如果匹配到则直接返回，
     * 如果和>sum,尾指针后移，如果和<sum,头指针前移
     *
     * @param arr
     * @param sum
     * @return
     */
    List<Integer> findNumbersWithSum(int[] arr, int sum) {
        List<Integer> result = new ArrayList<>();
        int start = 0, end = arr.length - 1;
        while (start < end) {
            if (arr[start] + arr[end] == sum) {
                result.add(start);
                result.add(end);
                break;
            }
            if (arr[start] + arr[end] > sum) {
                end--;
            }
            if (arr[start] + arr[end] < sum) {
                start++;
            }
        }
        return result;
    }
```

### T48:不用加减乘除做加法

写一个函数，求两个整数之和，要求在函数体内不得使用+、-、*、/四则运算符号。

```java
	boolean verifyBST(int[] sequence) {
        if (sequence.length == 0) {
            return false;
        }
        return isBST(sequence, 0, sequence.length - 1);
    }

    /**
     * 后序遍历序列的最后一个节点是根结点，根结点之前分为左右子树，满足左子树元素都小于根结点，右子树元素都大于根结点
     * 按照此思路递归左子树和右子树是否也满足
     *
     * @param sequence
     * @param start
     * @param end
     * @return
     */
    private boolean isBST(int[] sequence, int start, int end) {
        if (start >= end) {
            return true;
        }
        int i = end - 1;
        //从倒数第二个元素开始向前遍历，找到右子树与左子树临界点
        while (sequence[i] > sequence[end] && i > start) {
            i--;
        }
        //遍历左子树，如果含大于根节点元素即返回false
        for (int j = start; j < i; j++) {
            if (sequence[j] > sequence[end]) {
                return false;
            }
        }
        //递归左子树与右子树
        return isBST(sequence, start, i) && isBST(sequence, i + 1, end - 1);
    }
```

### T56:删除链表中重复的结点

在一个排序的链表中，存在重复的结点，请删除该链表中重复的结点，重复的结点不保留，返回链表头指针。例如，链表1->2->3->3->4->4->5 处理后为 1->2->5

```java
	/**
     * 递归思路，如果当前节点与下一个节点不相等时，
     * 递归当前节点的下一个节点，否则指针后移直到
     * 指向下一个不重复的节点,可以理解成预先处理下
     * 一个节点
     *
     * @param node
     * @return
     */
    ListNode deleteDuplication(ListNode node) {
        if (node == null || node.next == null) {
            return node;
        }
        // 如果当前节点与下一个节点重复
        if (node.var == node.next.var) {
            ListNode next = node.next;
            // 指向与下一个节点不重复的节点
            while (next != null && next.var == node.var) {
                next = next.next;
            }
            return deleteDuplication(next);
        } else {
            // 递归获取下一个节点指向
            node.next = deleteDuplication(node.next);
            return node;
        }
    }
```

### T57:二叉树的下一个结点

给定一个二叉树和其中的一个结点，请找出中序遍历顺序的下一个结点并且返回。注意，树中的结点不仅包含左右子结点，同时包含指向父结点的指针。

```java
	/**
     * 中序遍历的下一个结点分两种情况
     * 1.如果其右子树不为空，则下一个结点一定是其右子树下最左结点
     * 2.如果其右子树为空，则向上找第一个左链接指向的树包含该节点的祖先节点
     *
     * @param node
     * @return
     */
    TreeLinkNode findNext(TreeLinkNode node) {
        if (node == null) {
            return null;
        }
        if (node.right != null) {
            node = node.right;
            while (node.left != null) {
                node = node.left;
            }
            return node;
        } else {
            TreeLinkNode parent = node.next;
            while (parent != null) {
                if (parent.left == node) {
                    return parent;
                }
                // 当前结点指向其父结点
                node = node.next;
                // 父结点继续向上寻找
                parent = parent.next;
            }
        }
        return null;
    }
```

### T63:二叉搜索树的第k个结点

给定一棵二叉搜索树，请找出其中的第k小的结点。例如（5，3，7，2，4，6，8）中，按结点数值大小顺序第三小结点的值为4。	

```java
	/**
     * 索引计数器
     */
    int index = 0;

    /**
     * 二叉搜索树中序遍历是正序序列，因此返回第k个元素即第k小的结点
     *
     * @param root
     * @param k
     * @return
     */
    TreeNode findKth(TreeNode root, int k) {
        if (root != null) {
            TreeNode node = findKth(root.left, k);
            if (node != null) {
                return node;
            }
            if (++index == k) {
                return root;
            }
            node = findKth(root.right, k);
            if (node != null) {
                return node;
            }
        }
        return null;
    }
```

