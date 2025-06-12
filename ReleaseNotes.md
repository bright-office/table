
# Release Notes

## Features
(afc9967) feat: corrected the truncate property and added wordwrap property. --Saroj
(a36070d) feat: Better column pinning. --Saroj
(5149f7a) feat: corrected the whole table height calculation. --Saroj
(100f0cb) feat: Table Height with auto height is now fixed and working fine. --Saroj
(41cebcb) feat: updated the customizable header, and updated the identification --sarojregmi200
(10c167d) feat: accounting for hidden columns while counting for flexgrow --sarojregmi200
(13f45d4) feat: created a way to access hidden and pinned status of columns from table --sarojregmi200
(896049f) feat: stripe added --sarojregmi200
(295a1b2) feat: row selection on row click complete --Saroj
(79ef7f2) feat: corrected the theme --Saroj
(3211e11) feat(types): improved the type resolution --sarojregmi200
(7bb7f95) feat(dev): added support for type imports --sarojregmi200
(ed6b34b) feat(dev): Improved the dev experience. --sarojregmi200
(c4fdf83) feat: improved dev experience with better watch functionality --sarojregmi200
(cb233b3) feat(ColMod): recalculate dimensions based on column props change --sarojregmi200
(301e209) feat(hidden-col): wip --sarojregmi200
(0f760b5) feat(header-customization): Add means Ability to customize header by users. --Saroj
(70b5c3c) feat(table-top-nav): Added a way to add top navigation. --Saroj
(7cb9c5b) feat(nestedRowSelection): Added nested rowselection with auto parent/child selection and inversion conditions --Saroj
(9ea72e6) feat(row-selection): completed regular row selection --sarojregmi200
(3c01573) feat(checkbox): Added checkbox for row selection. --sarojregmi200
(51e9812) feat(pagination): pagination done --sarojregmi200
(30c800d) feat(ui): basic pagination UI complete. --sarojregmi200
(16721d2) feat(ui): Added tailwind support. --sarojregmi200
(bc72b90) feat(pagination): WIP. --sarojregmi200
(e1b85e6) feat(pagination): Client side pagination complete --sarojregmi200
(fbff303) feat(pagination): pagination setup with basic features complete --sarojregmi200
(e6b0231) feat(docs): facker setup done with mock data function for testing. --sarojregmi200
(5c43c09) feat(pagination): wip --sarojregmi200
(a594dd6) feat(build): updated the gulp to watch file changes. --sarojregmi200
(0903509) feat: Auto import default css done. --sarojregmi200

## Bug Fixes
(77aa6b6) fix: Removed the unnecessary object entries from column mod. And updated the current types to reflect the changes. --sarojregmi200
(fce0932) fix: Removed the unnecessary object entries from column mod. And updated the current types to reflect the changes. --sarojregmi200
(f84cc2d) fix: tree table children offset and some other minor issues. --sarojregmi200
(787277f) fix: Fixed the header alignment issue when no flex is given. --sarojregmi200
(52530a4) fix: corrected the selection checkbox height not being passed down --sarojregmi200
(f373f7b) fix: using button in case of disabled links --sarojregmi200
(0f1b053) fix: scroll bar reset to top before comingback to right place. --Saroj
(86505dc) fix: scroll reset issue. --Saroj
(67690ea) fix: performing a strict equals check of data rather than the reference of the data --sarojregmi200
(885150b) fix: cyclic object check, remove manual memo --sarojregmi200
(6720e47) fix: column alignment fixed --sarojregmi200
(4dcacf0) fix: background in actual columns instead or rows. --Saroj
(2fb8bd1) fix: scroll horizontal issue. --sarojregmi200
(c6b0292) fix: gap checkbox migrated to css --sarojregmi200
(63e251b) fix: tree table expand row alignment --sarojregmi200
(1d5f1e8) fix: scroll height calculation issue during active pagination and no pagination. --sarojregmi200
(41356b0) fix(tableHeight): updated the tableHeight calculation. --sarojregmi200
(ffaffd0) fix: width calculation issue due to row selection column. --sarojregmi200
(70a95bf) fix: fixed the checkbox alignment issue. --sarojregmi200
(685f56d) fix(rowselection): Nested column group left position fixed during row selction being active. --sarojregmi200
(3acd882) fix(error): removed all isdarkmode props. --sarojregmi200
(f362a8f) fix(darkmode): remove isDarkMode prop --sarojregmi200
(89f6390) fix(mergecell): fixed the props.readonly error while replacing the cells props. --sarojregmi200
(906c93c) fix(ui): Fixed the height and width issue during pagination and topnavigation --sarojregmi200
(95af8ea) fix(pin): removed duplicate key condition during pin change --sarojregmi200
(1da798b) fix(rerender): rerender issue. --sarojregmi200
(a0b139e) fix(layout): Improve the layout to account for height of pagination and top navigation. --Saroj
(09624f2) fix(rowselection): layout shift due to checkbox --Saroj
(d19a82f) fix(rowselection): global selection and inversion condition during global selection --Saroj
(cea2c71) fix(rowselection): Implemented a custom component and fixed the click issues. --Saroj
(1e4a09b) fix(pagination): pagination with row per page change. --sarojregmi200
(96c4479) fix(pagination): migration to larvel paginationwip --sarojregmi200
(f16c70b) fix(ui): prepend style import after transpilation. --sarojregmi200
(47de996) fix(ui): migration of less variables to css variables done. --sarojregmi200
(3e992a9) fix(build): updaed gulp to watch for nested files inside `src` directories. --sarojregmi200

## Small tasks
(aca935c) chore: removed a unused import --sarojregmi200
(a59a31a) chore: added a release mechanism and a workflow --sarojregmi200
(bd6bdda) chore: brought changes from upstream. --sarojregmi200
(7a3aea7) chore: Added displayName while sending data for ColumnModification. --Saroj
(fbe6aef) chore: version bump --sarojregmi200
(8a96024) chore: version bump --sarojregmi200
(e1ab46d) chore: forceupdate table --sarojregmi200
(c881ca5) chore: Fixed the fix issue --sarojregmi200
(5c76a46) chore: Added row border prop and rowHover prop --sarojregmi200
(20723a7) chore: corrected the border bottom, header alignment, pagination mismatch and loading error. --sarojregmi200
(1774de0) chore: removed unused and unnecessary dependencies. --Saroj
(087726f) chore: added striped row hover, and fixed the layout break in expand row --Saroj
(f186a77) chore: version bump --Saroj
(8f400cf) chore: version bump --sarojregmi200
(d9b1e6b) chore: fix rerender issues --sarojregmi200
(394204f) chore: version bump --sarojregmi200
(263d3b5) chore: updated the readme and corrected the author info --sarojregmi200
(ccf6b24) chore: version bump from alpha.5 -> alpha.6 --sarojregmi200
(805b3b6) chore: version bump from alpha.3 -> alpha.4 --sarojregmi200
(aa2f7c7) chore: made some changes --SakunPanthi123
(c12a3b6) chore: added a basic example table --sarojregmi200
(731d664) chore: moved variables to a custom layer. --sarojregmi200
(14930a9) chore: removed tailwind --sarojregmi200
(f3231d0) chore: removed tailwind --sarojregmi200
(f377709) chore: moving to no fork repo --sarojregmi200
(3fc942e) chore: version bump --Saroj
(8f313ec) chore: fix  scrollbar color --Saroj
(a30f77c) chore: corrected the naming of the variables. --Saroj
(476a39b) chore: version bump. --sarojregmi200
(29dae04) chore: version bump --sarojregmi200
(f054f4e) chore:version bump --sarojregmi200
(d0dde88) chore: Removed all the test files, and slimmed down the package.json --sarojregmi200
(3d3272f) chore(version): version bump --sarojregmi200
(a1ddd38) chore(publish): version bump from 0.0.4 -> 0.0.5 --sarojregmi200
(0ab8070) chore(publish): updated version --sarojregmi200
(3276610) chore(publish): updated the version and published. --sarojregmi200
(04d7d58) chore: moved everything to esm --Saroj
(8853249) chore(cleanup): remove gulpfile, backup and babel. --sarojregmi200
(f5aea4f) chore(docs): update feature notes. --sarojregmi200
(a996c83) chore(ui): Add theme object. --sarojregmi200
(0b12bcc) chore: ability to pass in additional props from table to the cell of the table. --sarojregmi200
(68871ba) chore(ui): Alternating pattern table rows done. --sarojregmi200
(9f4285e) chore: update test cases --sarojregmi200
(b051ba6) chore: documentation and progress --sarojregmi200

## Tests
(af1115b) test release --sarojregmi200

