import React from 'react';
import { useClassNames, convertToFlex } from './utils';
import { StandardProps } from './@types/common';

export interface ColumnGroupProps extends StandardProps {
    /** Alignment */
    align?: 'left' | 'center' | 'right';
    /** Vertical alignment */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /** Fixed column */
    fixed?: boolean | 'left' | 'right';

    /**
     * The height of the header of the merged cell group.
     * The default value is the square value of the table `headerHeight` value.
     **/
    groupHeaderHeight?: number;

    /** Group header */
    header?: React.ReactNode;
    width?: number;
    headerHeight?: number;

    /**
     * @inner internal use only
     */
    rowSelectionWidth?: number;
}

const ColumnGroup = React.forwardRef((props: ColumnGroupProps, ref: React.Ref<HTMLDivElement>) => {
    const {
        header,
        className,
        children,
        classPrefix = 'column-group',
        headerHeight = 80,
        verticalAlign,
        align,
        width,
        groupHeaderHeight: groupHeightProp,
        rowSelectionWidth,
        ...rest
    } = props;

    const groupHeight = typeof groupHeightProp !== 'undefined' ? groupHeightProp : headerHeight / 2;
    const restHeight =
        typeof groupHeightProp !== 'undefined' ? headerHeight - groupHeightProp : headerHeight / 2;

    const styles: React.CSSProperties = {
        height: groupHeight,
        width,
    };

    const { withClassPrefix, merge, prefix } = useClassNames(classPrefix);
    const classes = merge(className, withClassPrefix());
    const contentStyles = {
        ...convertToFlex({ verticalAlign, align }),
        ...styles,
    };

    return (
        <div
            ref={ref}
            className={classes}
            {...rest}
        >
            <div className={prefix('header')} style={{
                left: rowSelectionWidth,
                ...styles
            }}>
                <div className={prefix('header-content')} style={contentStyles}>
                    {header}
                </div>
            </div>

            {children
                ? React.Children.map(children as React.ReactElement[], (node: React.ReactElement) => {
                    return React.cloneElement(node, {
                        className: prefix('cell'),
                        predefinedStyle: { height: restHeight, top: styles.height },
                        headerHeight: restHeight,
                        verticalAlign: node.props.verticalAlign || verticalAlign,
                        children: <span className={prefix('cell-content')}>{node.props.children}</span>
                    });
                })
                : null}
        </div>
    );
});

ColumnGroup.displayName = 'Table.ColumnGroup';

export default ColumnGroup;
